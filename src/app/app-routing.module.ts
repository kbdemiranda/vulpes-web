import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {ListarServicosComponent} from "./pages/servicos/listar-servicos/listar-servicos.component";
import {DetalharServicoComponent} from "./pages/servicos/detalhar-servico/detalhar-servico.component";

const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: '', component: HomepageComponent },
  { path: 'servicos', component: ListarServicosComponent },
  { path: 'servico/:id', component: DetalharServicoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
