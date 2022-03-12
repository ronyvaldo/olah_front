import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IgrejasService } from '../services/igrejas.service';
import { Igreja } from '../igrejas/igreja';
import { LancamentosService } from '../services/lancamentos.service';
import { Lancamentos } from '../lancamentos/lancamentos';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../usuarios/usuario';
import { LancamentosIndicadores } from '../lancamentos/lancamentosIndicadores';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  @ViewChild("olahCanvas", {static: true}) chartElement: ElementRef;
  @ViewChild("olahCanvas2", {static: true}) chartElement2: ElementRef;
  @ViewChild("olahCanvas3", {static: true}) chartElement3: ElementRef;

  loginUsuarioLogado: string;
  igrejas: Igreja[];
  usuarioLogado: Usuario;
  isProcessandoIgreja: boolean = true;
  idIgrejaSelecionada: number;
  lancamentos: Lancamentos = new Lancamentos();
  lancamentosDespesa: LancamentosIndicadores[] = [];
  lancamentosContribuicoes: LancamentosIndicadores[] = [];
  mesAtual: string;

  constructor(private usuarioService: UsuariosService,
    private igrejasService: IgrejasService,
    private lancamentosService: LancamentosService) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuario();
    setTimeout(() => this.definirIgrejaSelecionada(), 1500);
    let monName = new Array ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro");
    this.mesAtual = monName[new Date().getMonth()] + "/"+ new Date().getFullYear();
  }

  gerarCharts() {
    this.gerarGrafico1();
    this.gerarGrafico2();
    this.gerarGrafico3();
  }

  gerarGrafico1() {
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
              data: [this.lancamentos.totalContribuicoes ? this.lancamentos.totalContribuicoes.toFixed(2) : 0,
                      this.lancamentos.totalDespesas ? this.lancamentos.totalDespesas.toFixed(2) : 0]
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

  gerarGrafico2() {
    if (this.chartElement2) {
      if (this.lancamentosDespesa.length > 0) {
        let labels = new Array;
        let data = new Array;
        this.lancamentosDespesa.forEach(l => {
          labels.push(l.tipo);
          data.push(l.valorTotal.toFixed(2));
        });
        new Chart(this.chartElement2.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: "",
                data: data
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
  }

  gerarGrafico3() {
    if (this.chartElement3) {
      if (this.lancamentosContribuicoes.length > 0) {
        let labels = new Array;
        let data = new Array;
        this.lancamentosContribuicoes.forEach(l => {
          labels.push(l.tipo);
          data.push(l.valorTotal.toFixed(2));
        });
        new Chart(this.chartElement3.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: "",
                data: data
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
        this.gerarDadosChart1();
        this.gerarDadosChart2();
        this.gerarDadosChart3();
        setTimeout(() =>this.gerarCharts(), 500);
    }
  }

  gerarDadosChart1() {
    this.lancamentosService.getLancamentos(this.idIgrejaSelecionada)
        .toPromise().then(lancamentos => {
          this.lancamentos = lancamentos;
          if (!this.lancamentos.totalDeMembros) {
            this.lancamentos.totalDeMembros = 0;
          }
        })
  }

  gerarDadosChart2() {
    this.lancamentosService.getLancamentosDespesas(this.idIgrejaSelecionada)
        .toPromise().then(lancamentos => {
          this.lancamentosDespesa = lancamentos;
        })
  }

  gerarDadosChart3() {
    this.lancamentosService.getLancamentosContribuicoes(this.idIgrejaSelecionada)
        .toPromise().then(lancamentos => {
          this.lancamentosContribuicoes = lancamentos;
        })
  }

}
