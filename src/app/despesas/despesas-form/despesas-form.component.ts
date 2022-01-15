import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DespesasService } from 'src/app/despesas.service';
import { IgrejasService } from 'src/app/igrejas.service';
import { Igreja } from 'src/app/igrejas/igreja';
import { TipoDespesa } from 'src/app/tipo-despesa/tipoDespesa';
import { TiposDespesasService } from 'src/app/tiposDespesas.service';
import { UsuariosService } from 'src/app/usuarios.service';
import { Despesa } from '../despesa';

@Component({
  selector: 'app-despesas-form',
  templateUrl: './despesas-form.component.html',
  styleUrls: ['./despesas-form.component.css']
})
export class DespesasFormComponent implements OnInit {

  loginUsuarioLogado: string;
  despesa : Despesa;
  success: boolean = false;
  errors: String[];
  id: number;
  acaoCadastrar: boolean;
  data: any;
  tiposDespesa: any;
  igrejas: Igreja[];
  isProcessandoIgreja: boolean = true;
  isProcessandoTipos: boolean = true;
  dataDespesaTemp: string;

  constructor( private service : DespesasService,
    private tiposService: TiposDespesasService,
    private router : Router,
    private usuarioService: UsuariosService,
    private igrejasService: IgrejasService,
    private activatedRoute : ActivatedRoute) {
      this.despesa = new Despesa();
  }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.despesa.tipoDespesa = new TipoDespesa();
    this.definirDadosDespesa();
  }

  onSubmit() {
    if (this.id) {
      this.service
      .atualizar(this.despesa)
      .toPromise().then(response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errrorResponse => {
        this.errors = ['Ocorreu um erro ao atualizar a despesa!']
      })
    } else {
      console.log(this.despesa);
      this.acaoCadastrar = true;
      this.definirIgrejaCadastro();
      this.service
      .salvar(this.despesa)
      .toPromise().then( response => {
        this.success = true;
        this.errors = [];
        this.voltarParaListagem();
      }, errorResponse => {
        this.success = false;
        if (errorResponse.error.errors) {
          this.errors = errorResponse.error.errors;
        } else {
          this.errors = ['Erro! Verifique se foram preenchidos todos os dados obrigatórios.'];
        }
      })
    }
  }

  definirDadosDespesa() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then(usuario => {
        this.despesa.usuarioCadastro = usuario;
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
            .toPromise().then(response => {
              this.igrejas = response;
              this.definirIgrejaCadastro();
              this.definirTiposDespesa();
            });
          }
          let params : Observable<Params> = this.activatedRoute.params;
          params.subscribe( urlParams => {
            this.id = urlParams['id'];
            if (this.id) {
              this.service.getDespesaById(this.id)
              .toPromise().then(
                response => {
                  this.despesa = response;
                  setTimeout(() => {
                    (document.getElementById('idTiposDespesa') as HTMLInputElement).value = this.despesa.tipoDespesa.id.toString()
                  }, 250);
                },
                errorResponse => this.despesa = new Despesa()
              )
            }
          })
        });
  }

  definirIgrejaCadastro() {
    if (this.igrejas.length == 1) {
      this.despesa.igreja = new Igreja();
      this.despesa.igreja.id = this.igrejas[0].id;
    }
    this.isProcessandoIgreja = false;
  }

  definirTiposDespesa() {
      this.tiposService.getTiposDespesa(this.despesa.igreja.id)
        .subscribe(tipos => {
          this.tiposDespesa = tipos;
        })
      this.isProcessandoTipos = false;
  }

  voltarParaListagem() {
    if (this.success) {
      setTimeout(() => {
        this.router.navigate(['/despesas/list']);
      } , 1500);
    } else {
      this.router.navigate(['/despesas/list']);
    }
  }

  atribuirIgreja(event: any) {
    if (!this.despesa.igreja) {
      this.despesa.igreja = new Igreja();
    }
    this.despesa.igreja.id = event.target.value;
  }

  atribuirTipoDeDespesa(event: any) {
    if (!this.despesa.tipoDespesa) {
      this.despesa.tipoDespesa = new TipoDespesa();
    }
    this.despesa.tipoDespesa.id = event.target.value;
  }

  converterData(event: any) {
    let data = event.day+"-"+event.month+"-"+event.year;
    let parsedDate = moment(data, "DD-MM-YYYY");
    let outputDate = parsedDate.format("DD/MM/YYYY");
    this.despesa.dataDespesa = outputDate;
  }

}
