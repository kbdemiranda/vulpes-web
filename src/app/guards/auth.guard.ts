import {inject, Injectable} from '@angular/core';
import {UserService} from "../services/user.service";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLogged()) {
      // Se não estiver logado, redireciona para a página de login
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
