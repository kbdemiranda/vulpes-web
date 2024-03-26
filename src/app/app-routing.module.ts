import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {ListarServicosComponent} from "./pages/servicos/listar-servicos/listar-servicos.component";
import {DetalharServicoComponent} from "./pages/servicos/detalhar-servico/detalhar-servico.component";
import {ListarAssinantesComponent} from "./pages/assinantes/listar-assinantes/listar-assinantes.component";
import {DetalharAssinanteComponent} from "./pages/assinantes/detalhar-assinante/detalhar-assinante.component";
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuard as authGuard} from "./guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: HomepageComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'servicos', component: ListarServicosComponent, canActivate: [authGuard] },
  { path: 'servico/:id', component: DetalharServicoComponent, canActivate: [authGuard] },
  { path: 'assinantes', component: ListarAssinantesComponent, canActivate: [authGuard] },
  { path: 'assinante/:id', component: DetalharAssinanteComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
