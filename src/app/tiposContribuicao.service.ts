import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TipoContribuicao } from "./tipo-contribuicao/tipoContribuicao";

@Injectable({
    providedIn: 'root'
})
export class TiposContribuicaoService {

    apiURL: string = environment.apiUrlBase + "/api/tiposContribuicao";

    constructor( private http: HttpClient ) { }

    getTiposContribuicao(idIgreja: number) : Observable<TipoContribuicao[]> {
        return this.http.get<TipoContribuicao[]>(this.apiURL+`/idIgreja=${idIgreja}`);
    }


}