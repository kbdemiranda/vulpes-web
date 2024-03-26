import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Assinante, AssinanteDetalhado} from "../models/assinante";

export interface PaginaDeAssinantes {
  content: Assinante[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Número da página atual
}

@Injectable({
  providedIn: 'root'
})
export class AssinanteService {

  private readonly API = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) { }

  getAssinantes(page: number = 0, size: number = 10): Observable<PaginaDeAssinantes> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.get<PaginaDeAssinantes>(this.API + '/assinantes', {params});
  }

  getAssinanteDetalhado(id: number): Observable<AssinanteDetalhado> {
    return this.httpClient.get<AssinanteDetalhado>(`${this.API + '/assinantes'}/${id}`)
      .pipe(
        // tap(data => console.info('Dados recebidos do backend:', data)),
        catchError(error => {
          console.error('Erro ao buscar dados:', error);
          return throwError(() => error);
        })
      );
  }



}
