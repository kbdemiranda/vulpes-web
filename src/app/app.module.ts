import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {NgOptimizedImage} from "@angular/common";
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ListarServicosComponent } from './pages/servicos/listar-servicos/listar-servicos.component';
import { CardComponent } from './components/card/card.component';
import { DetalharServicoComponent } from './pages/servicos/detalhar-servico/detalhar-servico.component';
import { ListarAssinantesComponent } from './pages/assinantes/listar-assinantes/listar-assinantes.component';
import { DetalharAssinanteComponent } from './pages/assinantes/detalhar-assinante/detalhar-assinante.component';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    ListarServicosComponent,
    CardComponent,
    DetalharServicoComponent,
    ListarAssinantesComponent,
    DetalharAssinanteComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
