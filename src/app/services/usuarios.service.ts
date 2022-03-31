import { Injectable } from '@angular/core';
import { Usuario } from '../usuarios/usuario';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenDto } from '../models/token-dto';
import { PaginaUsuario } from '../usuarios/paginaUsuario';

const header = {headers: new HttpHeaders({'content-Type' : 'application/json'})};
const Token_key = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  apiURL: string = environment.apiUrlBase + "/api/usuarios";
  apiURLSenha: string = environment.apiUrlBase + "/api/senha";
  tokenUrl: string = environment.apiUrlBase + environment.tokenUrl;
  cientId: string = environment.clientId;
  clientSecret: string = environment.clientSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();

  
  constructor( private http: HttpClient ) { }
  

  obterToken() {
    const tokenString = sessionStorage.getItem('access_token');
    if (tokenString) {
      const token = JSON.parse(tokenString).access_token;
      return token;
    }
    return null;
  }

  encerrarSessao() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('info_congregacao');
  }

  getUsuarioAutenticado() {
    const token = this.obterToken();
    if (token) {
       const usuario = this.jwtHelper.decodeToken(token).user_name;
       return usuario;
    }
    return null;
  }

  isAuthenticated() : boolean {
    const token = this.obterToken();
    if (token) {
      const expired = this.jwtHelper.isTokenExpired(token);
      return !expired;
    }
    return false;
  }

  salvar( usuario : Usuario ) : Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURL, usuario);
  }

  autocadastro( usuario : Usuario ) : Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURL+'/autocadastro', usuario);
  }

  atualizar( usuario : Usuario ) : Observable<any> {
    return this.http.put<Usuario>(this.apiURL + `/${usuario.id}`, usuario);
  }

  inativar( usuario : Usuario ) : Observable<any> {
    return this.http.put<Usuario>(this.apiURL + `/inativar/${usuario.id}`, usuario);
  }

  deletar( usuario : Usuario ) : Observable<any> {
    return this.http.delete<any>(this.apiURL + `/${usuario.id}`);
  }
  
  getUsuarios() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiURL);
  }

  getUsuarioById(id: number) : Observable<Usuario> {
    return this.http.get<any>(this.apiURL + `/${id}`);
  }

  getUsuarioByCredential(login: string) : Observable<Usuario> {
    return this.http.get<any>(this.apiURL + `/pesquisaCredencial=${login}`);
  }

  getUsuariosByPerfil(perfil: number, page: string, size: string) : Observable<PaginaUsuario> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiURL}/perfil=${perfil}?${params.toString()}`);
    //return this.http.get<any>(this.apiURL + `/perfil=${perfil}`);
  }

  tentarLogar( username: string, password: string ) : Observable<any> {
    const params = new HttpParams()
        .set('username', username)
        .set('password', password)
        .set('grant_type','password')
    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.cientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return this.http.post( this.tokenUrl, params, { headers } )
  }

  public getToken(): string {
    return sessionStorage.getItem(Token_key) || '';
  }

  public setToken(token : string): void {
    sessionStorage.removeItem(Token_key);
    sessionStorage.setItem(Token_key, token);
  }

  public google(tokenDto : TokenDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrlBase + "/api/oauth/google", tokenDto, header);
  }

  public facebook(tokenDto : TokenDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrlBase + "/api/oauth/facebook", tokenDto, header);
  }

  getMembrosPorNomeLike(nome: string) : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiURL+ `/likeNomeMembro=${nome}`);
  }

  converterEmMembro(id: number) : Observable<any> {
    return this.http.put<any>(this.apiURL + `/converter=${id}`, null);
  }

  editarSenha(idUsuario: number, senhaAtual: string, novaSenha: string) : Observable<any> {
    let atualizacaoSenha = {
      idUsuario: idUsuario,
      senhaAtual: senhaAtual,
      novaSenha: novaSenha
    }
    return this.http.put<Usuario>(this.apiURLSenha + "/atualizar", atualizacaoSenha);
  }

  pesquisaUsuarioSemAcesso(credencial: string) : Observable<Usuario> {
    return this.http.get<Usuario>(this.apiURL + `/pesquisaUsuarioSemAcesso=${credencial}`);
  }

  inserirSenha(credencial: string, senha: string) : Observable<any> {
    const params = new HttpParams()
      .set('senha', senha);
      return this.http.put<any>(this.apiURL + `/inserirSenha=${credencial}?${params.toString()}`, null);
  }

}
