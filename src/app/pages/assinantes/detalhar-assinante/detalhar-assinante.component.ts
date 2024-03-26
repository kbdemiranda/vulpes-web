import {Component, OnInit} from '@angular/core';
import {Assinante, AssinanteDetalhado} from "../../../models/assinante";
import {AssinanteService} from "../../../services/assinante.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detalhar-assinante',
  templateUrl: './detalhar-assinante.component.html',
  styleUrls: ['./detalhar-assinante.component.scss']
})
export class DetalharAssinanteComponent implements OnInit{
  assinante: AssinanteDetalhado | null = null;

  constructor(
    private assinanteService: AssinanteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // Pega o ID da URL
    this.carregarAssinantes(id);
  }

  carregarAssinante(id: number): void {
    this.assinanteService.getAssinanteDetalhado(id).subscribe({
      next: (detalhes) => {
        this.assinante = detalhes;
      },
      error: (erro) => console.error(erro),
      // complete: () => console.log('Detalhamento do assinante completo')
    });
  }

  carregarAssinantes(id: number): void {
    this.assinanteService.getAssinanteDetalhado(id).subscribe({
      next: (data) => {
        // console.log('Dados no componente:', data);
        this.assinante = data;
      },
      error: (erro) => console.error('Erro no componente:', erro),
    });
  }

  formatarValor(valor: number): string {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }




}
