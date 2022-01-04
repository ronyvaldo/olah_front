import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { Contribuicao } from "./contribuicoes/contribuicao";
import { PaginaContribuicao } from "./contribuicoes/paginaContribuicao";

@Injectable({
    providedIn: 'root'
})
export class ContribuicoesService {

    apiURL: string = environment.apiUrlBase + "/api/contribuicoes";

    constructor( private http: HttpClient ) { }

    salvar( contribuicao : Contribuicao ) : Observable<Contribuicao> {
        return this.http.post<Contribuicao>(this.apiURL, contribuicao);
    }

    atualizar( contribuicao : Contribuicao ) : Observable<any> {
        return this.http.put<Contribuicao>(this.apiURL + `/${contribuicao.id}`, contribuicao);
    }

    deletar( contribuicao : Contribuicao ) : Observable<any> {
        return this.http.delete<any>(this.apiURL + `/${contribuicao.id}`);
    }

    getContribuicoes(page: string, size: string) : Observable<PaginaContribuicao> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get<any>(`${this.apiURL}?${params.toString()}`);
    }

    getContribuicaoById(id: number) : Observable<Contribuicao> {
        return this.http.get<any>(this.apiURL + `/${id}`);
    }


}