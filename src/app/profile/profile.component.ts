import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../usuarios/usuario';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  usuarioLogado: Usuario;
  mensagem: string;
  editandoCadastro: boolean;
  editandoSenha: boolean;
  telefoneCelular: string;
  cpf: string;
  senhaAtual: string;
  novaSenha1: string;
  novaSenha2: string;
  nomeUsuario: string;
  emailUsuario: string;
  mensagemSucesso: string;
  confirmPass: boolean;
  errors: String[];

  constructor(private usuarioService : UsuariosService) { }

  ngOnInit(): void {
    this.comporUsuarioLogado();
  }

  comporUsuarioLogado() {
    this.usuarioService.getUsuarioByCredential(this.usuarioService.getUsuarioAutenticado())
      .toPromise().then(
        response => {
          this.usuarioLogado = response;
          setTimeout (() => this.resetUsuario(), 500);
        },
        errorResponse => this.mensagem = "Desculpe. Ocorreu um erro inesperado!"
      )
  }

  resetUsuario() {
    this.emailUsuario = this.usuarioLogado.email;
    this.nomeUsuario = this.usuarioLogado.nome;
    this.cpf = this.usuarioLogado.cpf;
    this.telefoneCelular = '';
    if (this.usuarioLogado.numeroCelular && this.usuarioLogado.numeroCelular.length > 1) {
      this.telefoneCelular = this.usuarioLogado.dddCelular + this.usuarioLogado.numeroCelular;
      this.mphone();
    }
    if (this.cpf.length == 11) {
      this.mcpf();
    }
  }

  mphone() {
    if (this.telefoneCelular && this.telefoneCelular != "") {
        let r = this.telefoneCelular;
        r = r.replace(/\D/g, "");
        r = r.replace(/^0/, "");
        if (r.length > 10) {
          r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (r.length > 5) {
          r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (r.length > 2) {
          r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        } else {
          r = r.replace(/^(\d*)/, "($1");
        }
        this.telefoneCelular = r;
      }
    }

    mcpf() {
      if (this.cpf && this.cpf != "") {
        let r = this.cpf;
        if (r.length > 10) {
          r = r.replace(/[^\d]/g, "");
          r = r.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        this.cpf = r;
      }
    }

    editarCadastro() {
      this.errors = [];
      this.mensagemSucesso = '';
      this.editandoCadastro = true;
    }

    cancelarEdicaoCadastro() {
      this.editandoCadastro = false;
      this.errors = [];
      this.mensagemSucesso = '';
      this.resetUsuario();
    }

    editarSenha() {
      this.errors = [];
      this.mensagemSucesso = '';
      this.editandoSenha = true;
    }

    cancelarEdicaoSenha() {
      this.editandoSenha = false;
      this.senhaAtual = '';
      this.novaSenha1 = '';
      this.novaSenha2 = '';
      this.errors = [];
      this.mensagemSucesso = '';
    }

    onSubmit() {
      if (this.editandoSenha) {
        if (this.confirmPass) {
        this.usuarioService
        .editarSenha(this.usuarioLogado.id, this.senhaAtual, this.novaSenha1)
        .subscribe(response => {
          this.errors = [];
          this.exibirMensagemSucesso('Senha alterada com sucesso!');
          this.editandoSenha = false;
        }, errorResponse => {
          if (errorResponse.error.errors) {
            this.mensagemSucesso = '';
            this.exibirMensagemDeErro(errorResponse.error.errors[0]);
          }
        })
      } else {
        this.mensagemSucesso = '';
      }
    } else if (this.editandoCadastro) {
      let nome = this.usuarioLogado.nome;
      let cpf = this.usuarioLogado.cpf;
      let email = this.usuarioLogado.email;
      let dddCelular = this.usuarioLogado.dddCelular;
      let numeroCelular = this.usuarioLogado.numeroCelular;
      this.definirDadosDoUsuarioParaAtualizacao();
      this.usuarioService
      .atualizar(this.usuarioLogado)
        .subscribe(response => {
          this.errors = [];
          this.exibirMensagemSucesso('Dados cadastrais atualizados com sucesso!');
          this.editandoCadastro = false;
          this.comporUsuarioLogado();
        }, errrorResponse => {
          this.usuarioLogado.nome = nome;
          this.usuarioLogado.cpf = cpf;
          this.usuarioLogado.email = email;
          this.usuarioLogado.dddCelular = dddCelular;
          this.usuarioLogado.numeroCelular = numeroCelular;
          this.errors = errrorResponse.error.errors;
        })
    }
  }

  definirDadosDoUsuarioParaAtualizacao() {
    this.usuarioLogado.nome = this.nomeUsuario;
    this.usuarioLogado.email = this.emailUsuario;
    if (this.cpf && this.cpf.length == 14) {
      this.usuarioLogado.cpf = (this.cpf.split('.').join('')).split('-').join('');
      //this.cpf.replace('.','').replace('.','').replace('-','');
    } else {
      this.usuarioLogado.cpf = this.cpf;
    }
    if (this.telefoneCelular && this.telefoneCelular.length == 15) {
      let telefone = this.telefoneCelular.replace('(','').replace(')','').replace('-','').trim();
      this.usuarioLogado.dddCelular = telefone.substring(0,2);
      this.usuarioLogado.numeroCelular = telefone.substring(2,12);
    } else {
      this.usuarioLogado.dddCelular = '';
      this.usuarioLogado.numeroCelular = '';
    }
  }

  checkSenhas() {
    let pass = this.novaSenha1;
    let pass2 = this.novaSenha2;
    if ((pass != undefined && pass.length > 0)  && pass2.length > 0) {
      if (pass === pass2 && this.senhaAtual != pass) {
        this.confirmPass = true;
        this.errors = [];
      } else {
        if (pass != pass2) {
          this.confirmPass = false
          this.exibirMensagemDeErro('Favor, rever confirmação da nova senha, pois não coincide com a nova senha informada.');
        } else {
          this.confirmPass = false
          this.exibirMensagemDeErro('A nova senha deve ser diferente da senha atual.');
        }
      }
    } else {
      this.errors = [];
      this.confirmPass = true;
    }
  }

  exibirMensagemDeErro(mensagem: string) {
    this.mensagemSucesso = '';
    this.errors = [];
    this.errors[0] = mensagem;
    $(window).scrollTop(0);
  }

  exibirMensagemSucesso(mensagem: string) {
    this.errors = [];
    this.mensagemSucesso = mensagem;
    $(window).scrollTop(0);
  }


}
