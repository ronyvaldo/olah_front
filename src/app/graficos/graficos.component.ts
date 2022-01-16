import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IgrejasService } from '../igrejas.service';
import { Igreja } from '../igrejas/igreja';
import { LancamentosService } from '../lancamentos.service';
import { Lancamentos } from '../lancamentos/lancamentos';
import { UsuariosService } from '../usuarios.service';
import { Usuario } from '../usuarios/usuario';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  @ViewChild("olahCanvas", {static: true}) chartElement: ElementRef;

  loginUsuarioLogado: string;
  igrejas: Igreja[];
  usuarioLogado: Usuario;
  isProcessandoIgreja: boolean = true;
  idIgrejaSelecionada: number;
  lancamentos: Lancamentos;

  constructor(private usuarioService: UsuariosService,
    private igrejasService: IgrejasService,
    private lancamentosService: LancamentosService) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuario();
    setTimeout(() => this.definirIgrejaSelecionada(), 800);
  }

  gerarCharts() {
    if (this.chartElement) {
      new Chart(this.chartElement.nativeElement, {
        type: 'bar',
        data: {
          labels: ["Contribuições", "Despesas"],
          datasets: [
            {
              label: "",
              backgroundColor: ["#03B149", "#F23656"],
              barPercentage: .3,
              data: [this.lancamentos.totalContribuicoes.toFixed(2), this.lancamentos.totalDespesas.toFixed(2)]
            }
          ]
        },
        options: {
          plugins: {
            legend: {
                display: false
            }
          }
        }
      });
    }
  }

  definirDadosDoUsuario() {
    this.usuarioService.getUsuarioByCredential(this.loginUsuarioLogado)
      .toPromise().then(usuario => {
        this.usuarioLogado = usuario;
        if (usuario.igrejas.length > 0) {
          this.igrejas = usuario.igrejas;
        } else {
          this.igrejasService.getIgrejasByGrupoCongregacional(usuario.grupoCongregacional.id)
            .toPromise().then(response => {
              this.igrejas = response;
              if (this.igrejas.length == 1) {
                this.idIgrejaSelecionada = this.igrejas[0].id;
              }
            });
          }
        });
    this.isProcessandoIgreja = false;
  }

  definirIgrejaSelecionada() {
    if (this.idIgrejaSelecionada) {
      this.lancamentosService.getLancamentos(this.idIgrejaSelecionada)
        .toPromise().then(lancamentos => {
          this.lancamentos = lancamentos;
          this.gerarCharts();
        })
    }
  }

}
