import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GrupoCongregacional } from "../grupos-congregacionais/grupoCongregacional";
import { PaginaGrupoCongregacional } from "../grupos-congregacionais/PaginaGrupoCongregacional";

@Injectable({
    providedIn: 'root'
})
export class GruposCongregacionaisService {
    
    apiURL: string = environment.apiUrlBase + "/api/grupos";

    constructor( private http: HttpClient ) { }

    getTodos(page: string, size: string) : Observable<PaginaGrupoCongregacional> {
        const params = new HttpParams()
        .set('page', page)
        .set('size', size);
        return this.http.get<any>(this.apiURL+`?${params.toString()}`);
    }

    getGrupoById(id: number) : Observable<GrupoCongregacional> {
        return this.http.get<any>(this.apiURL + `/${id}`);
    }

    salvar( grupo : GrupoCongregacional ) : Observable<GrupoCongregacional> {
        return this.http.post<GrupoCongregacional>(this.apiURL, grupo);
    }

    atualizar( grupo : GrupoCongregacional ) : Observable<any> {
        return this.http.put<GrupoCongregacional>(this.apiURL + `/${grupo.id}`, grupo);
    }
}