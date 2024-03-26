import { Injectable } from '@angular/core';

const KEY = 'token';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  saveToken(token: string) {
    return localStorage
      .setItem(KEY, token);
  }

  getToken() {
    return localStorage
      .getItem(KEY);
  }

  hasToken() {
    return !!this.getToken();
  }

  removeToken() {
    return localStorage
      .removeItem(KEY);
  }
}
