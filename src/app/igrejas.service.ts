import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Igreja } from "./igrejas/igreja";

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

    getIgrejasPorNomeLike(nome: string) : Observable<Igreja[]> {
        return this.http.get<Igreja[]>(this.apiURL+ `/likeNome=${nome}`);
    }
}