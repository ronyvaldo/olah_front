import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Igreja } from "../igrejas/igreja";
import { PaginaIgreja } from "../igrejas/paginaIgreja";

@Injectable({
    providedIn: 'root'
})
export class IgrejasService {

    apiURL: string = environment.apiUrlBase + "/api/igrejas";

    constructor( private http: HttpClient ) { }

    getTodas() : Observable<Igreja[]> {
        return this.http.get<any>(this.apiURL);
    }

    getIgrejasByGrupoCongregacional(idGrupo: number) : Observable<Igreja[]> {
        return this.http.get<any>(this.apiURL + `/grupoCongregacional=${idGrupo}`);
    }

    getIgrejasByGrupoCongregacionalPaged(idGrupo: number, page: string, size: string) : Observable<PaginaIgreja> {
        const params = new HttpParams()
        .set('page', page)
        .set('size', size);
        return this.http.get<any>(this.apiURL + `/grupoCongregacionalPaged=${idGrupo}?${params.toString()}`);
    }

    getIgrejasPorNomeLike(nome: string) : Observable<Igreja[]> {
        return this.http.get<Igreja[]>(this.apiURL+ `/likeNome=${nome}`);
    }

    salvar( igreja : Igreja ) : Observable<Igreja> {
        return this.http.post<Igreja>(this.apiURL, igreja);
    }

    atualizar( igreja : Igreja ) : Observable<any> {
        return this.http.put<Igreja>(this.apiURL + `/${igreja.id}`, igreja);
    }

    getIgrejaById(id: number) : Observable<Igreja> {
        return this.http.get<any>(this.apiURL + `/${id}`);
    }

    deletar( igreja : Igreja ) : Observable<any> {
        return this.http.delete<any>(this.apiURL + `/${igreja.id}`);
    }
    
}