import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Lancamentos } from "../lancamentos/lancamentos";
import { LancamentosIndicadores } from "../lancamentos/lancamentosIndicadores";

@Injectable({
    providedIn: 'root'
  })
export class LancamentosService {

    apiURL: string = environment.apiUrlBase + "/api/lancamentos";

    constructor( private http: HttpClient ) { }

    getLancamentos(idIgreja: number) : Observable<Lancamentos> {
        return this.http.get<any>(this.apiURL + `/porIgreja=${idIgreja}`);
    }

    getLancamentosDespesas(idIgreja: number) : Observable<LancamentosIndicadores[]> {
        return this.http.get<any>(this.apiURL + `/indicadoresDespesas=${idIgreja}`);
    }

    getLancamentosContribuicoes(idIgreja: number) : Observable<LancamentosIndicadores[]> {
        return this.http.get<any>(this.apiURL + `/indicadoresContribuicoes=${idIgreja}`);
    }

}