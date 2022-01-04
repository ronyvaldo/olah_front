import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { Despesa } from "./despesas/despesa";
import { PaginaDespesa } from "./despesas/PaginaDespesa";

@Injectable({
    providedIn: 'root'
})
export class DespesasService {
    
    apiURL: string = environment.apiUrlBase + "/api/despesas";

    constructor( private http: HttpClient ) { }

    salvar( despesa : Despesa ) : Observable<Despesa> {
        return this.http.post<Despesa>(this.apiURL, despesa);
    }

    atualizar( despesa : Despesa ) : Observable<any> {
        return this.http.put<Despesa>(this.apiURL + `/${despesa.id}`, despesa);
    }

    deletar( despesa : Despesa ) : Observable<any> {
        return this.http.delete<any>(this.apiURL + `/${despesa.id}`);
    }

    getDespesas(page: string, size: string) : Observable<PaginaDespesa> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get<any>(`${this.apiURL}?${params.toString()}`);
    }

    getDespesaById(id: number) : Observable<Despesa> {
        return this.http.get<any>(this.apiURL + `/${id}`);
    }
    
}