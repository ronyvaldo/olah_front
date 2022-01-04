import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TipoDespesa } from "./tipo-despesa/tipoDespesa";

@Injectable({
    providedIn: 'root'
})
export class TiposDespesasService {

    apiURL: string = environment.apiUrlBase + "/api/tiposDespesa";

    constructor( private http: HttpClient ) { }

    getTiposDespesa(idIgreja: number) : Observable<TipoDespesa[]> {
        return this.http.get<TipoDespesa[]>(this.apiURL+`/idIgreja=${idIgreja}`);
    }

}