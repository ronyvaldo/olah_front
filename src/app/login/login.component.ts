import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../usuarios/usuario';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { TokenDto } from '../models/token-dto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Igreja } from '../igrejas/igreja';
import { IgrejasService } from '../services/igrejas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form : FormGroup;

  usuario : Usuario;
  cadastrando: boolean;
  confirmPass: boolean = true;
  mensagemSucesso: string;
  errors: string[];
  igrejas: Igreja[];
  filteredOptions: Observable<string[]>;
  keyword = 'nome';

  socialUser: SocialUser;
  userLogged: SocialUser;
  isLogged: boolean;

  secretSocial: string = environment.secretSocial;

  loginForm = new FormControl();
  
  constructor(private router: Router,
              private usuarioService: UsuariosService,
              private igrejaService: IgrejasService,
              private fb: FormBuilder,
              private authService: SocialAuthService) {
    this.inicializaUsuario();
  }

  ngOnInit(): void {
    if (this.usuarioService.getUsuarioAutenticado()) {
      this.router.navigate(['/home']);
    }
    this.form = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }

  inicializaUsuario() {
    this.usuario = new Usuario();
  }

  onSubmit() {
    this.usuarioService
      .tentarLogar(this.usuario.login, this.usuario.senha)
      .subscribe( response => {
        const access_token =  JSON.stringify(response);
        sessionStorage.setItem('access_token', access_token);
        //this.definirDadosIgreja();
        this.router.navigate(['/home'])
      }, errorResponse => {
        this.errors = ['Usuário e/ou senha incorreto(s).']
      })
  }

  /*definirDadosIgreja() {
    let usuarioObservable = new Observable<Usuario>();
    usuarioObservable = this.usuarioService.getUsuarioByCredential(this.usuario.login);
    usuarioObservable
      .subscribe(usuario => {
        if (usuario.igrejas.length > 0) {
          sessionStorage.setItem('info_congregacao', usuario.igrejas[0].nome);
        } else if (usuario.grupoCongregacional) {
          sessionStorage.setItem('info_congregacao', usuario.grupoCongregacional.nome);
        }
    });
  }*/

  prepararCadastro(event:any) {
    event.preventDefault();
    this.usuario = new Usuario();
    this.cadastrando = true;
  }

  cancelarCadastro() {
    this.cadastrando = false;
    this.confirmPass = true
  }

  checkSenhas(event:any) {
    let pass = this.usuario.senha;
    let pass2 = event.target.value;
    if ((pass != undefined && pass.length > 0)  && pass2.length > 0) {
      pass === pass2 ? this.confirmPass = true : this.confirmPass = false;
    } else {
      this.confirmPass = true
    }
  }

  cadastrar() {
    if (this.confirmPass) {
      this.usuario.perfil = 0;
      this.usuarioService.autocadastro(this.usuario)
        .subscribe( response => {
          this.mensagemSucesso = `Cadastro realizado com sucesso! Utilizar o login ${this.usuario.email} para acessar a aplicação.`
          this.cadastrando = false;
          this.inicializaUsuario();
          this.errors = [];
        }, errorResponse => {
          this.mensagemSucesso = '';
          this.errors = errorResponse.error.errors;
        })
     }
  }

  //Login Social
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        const tokenGoogle = new TokenDto(this.socialUser.idToken);
        this.usuarioService.google(tokenGoogle).subscribe(
          res => {
            this.usuario.login = this.socialUser.email;
            this.usuario.senha = this.secretSocial;
            this.onSubmit();
          },
          err => {
            this.logout();
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
      }
    );
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        const tokenFace = new TokenDto(this.socialUser.authToken);
        this.usuarioService.facebook(tokenFace).subscribe(
          res => {
            this.usuario.login = this.socialUser.email;
            this.usuario.senha = this.secretSocial;
            this.onSubmit();
          },
          err => {
            this.logout();
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
      }
    );
  }

  logout() {
    this.usuarioService.encerrarSessao();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  igrejaSelecionada(event: any) {
    let igreja = new Igreja();
    igreja.id = event.id;
    this.usuario.igrejas = [];
    this.usuario.igrejas[0] = igreja;
  }

  onChangeSearch(event: string) {
    this.igrejas = [];
    let igrejasObservable = new Observable<Igreja[]>();
    igrejasObservable = this.igrejaService.getIgrejasPorNomeLike(event);
    igrejasObservable.subscribe( response => {
      this.igrejas = response;
    });
  }

}
