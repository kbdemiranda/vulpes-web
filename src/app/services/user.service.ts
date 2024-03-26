import { Injectable } from '@angular/core';
import {TokenService} from "./token.service";
import {BehaviorSubject} from "rxjs";
import {Usuario} from "../models/usuario";
import { jwtDecode }  from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(private tokenService: TokenService) {
    if(this.tokenService.hasToken()) {
      this.decodeAndNotify();
    }
  }

  private decodeAndNotify() {
    const token = this.tokenService.getToken();
    // @ts-ignore
    const user = jwtDecode(token) as Usuario;
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  saveToken(token: string) {
    this.tokenService.saveToken(token);
    this.decodeAndNotify();
  }

  logout() {
    this.tokenService.removeToken();
    this.userSubject.next(null);
  }

  isLogged() {
    return this.tokenService.hasToken();
  }
}
