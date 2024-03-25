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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    ListarServicosComponent,
    CardComponent,
    DetalharServicoComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
