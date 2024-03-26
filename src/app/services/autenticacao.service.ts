import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {UserService} from "./user.service";

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private apiUrl: string = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private userSerivce: UserService) {
  }

  autenticar(email: string, senha: string): Observable<any> {
    console.log(`${this.apiUrl}/auth/login`);
    return this.http.post(`${this.apiUrl}/auth/login`,
      {email, senha}, {responseType: 'text'}).pipe(
        tap((token: string) => {
          this.userSerivce.saveToken(token);
        }
    ));
  }

  authenticate(email: string, senha: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        email,
        senha
      })
      .pipe(
        tap(response => {
          this.userSerivce.saveToken(response.token);
        })
      );
  }
}
