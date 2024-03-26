import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private apiUrl: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  autenticar(email: string, senha: string): Observable<any> {
    console.log(`${this.apiUrl}/auth/login`);
    return this.http.post(`${this.apiUrl}/auth/login`, { email, senha }, { responseType: 'text'})
  }
}
