import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class ReportsService {

    apiURL: string = environment.apiUrlBase + "/api/relatorios";

    constructor( private http: HttpClient ) { }

    gerarRelatorioDeMembrosDaIgreja(idIgreja : number) : Observable<Blob> {
        return this.http.get(this.apiURL + `/membros=${idIgreja}`, {
            responseType: 'blob'
          });
    }
    
}