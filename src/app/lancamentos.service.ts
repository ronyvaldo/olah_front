import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Lancamentos } from "./lancamentos/lancamentos";

@Injectable({
    providedIn: 'root'
  })
export class LancamentosService {

    apiURL: string = environment.apiUrlBase + "/api/lancamentos";

    constructor( private http: HttpClient ) { }

    getLancamentos(idIgreja: number) : Observable<Lancamentos> {
        return this.http.get<any>(this.apiURL + `/porIgreja=${idIgreja}`);
    }

}