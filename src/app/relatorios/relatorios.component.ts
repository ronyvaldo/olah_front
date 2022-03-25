import { Component, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { Igreja } from '../igrejas/igreja';
import { IgrejasService } from '../services/igrejas.service';
import { ReportsService } from '../services/reports.service';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../usuarios/usuario';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  loginUsuarioLogado: string;
  igrejas: Igreja[];
  usuarioLogado: Usuario;
  idIgrejaSelecionada: number;
  isProcessandoIgreja: boolean = true;

  constructor(private usuarioService: UsuariosService,
    private igrejasService: IgrejasService,
    private reportsService : ReportsService,
    private fileSaver : FileSaverService) { }

  ngOnInit(): void {
    this.loginUsuarioLogado = this.usuarioService.getUsuarioAutenticado();
    this.definirDadosDoUsuario();
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
              if (this.igrejas.length > 1) {
                this.idIgrejaSelecionada = this.igrejas[0].id;
              }
            });
          }
        });
      this.isProcessandoIgreja = false;
  }

  gerarRelatorioDeMembros() {
    if (this.idIgrejaSelecionada) {
      this.reportsService.gerarRelatorioDeMembrosDaIgreja(this.idIgrejaSelecionada)
        .subscribe(res => {
          let blob = new Blob([res.body], { type: res.headers.get('content-type') + '; charset=utf-8'});
          let headers = res.headers ? res.headers : new Map();
          let fileName = headers.get('content-disposition').split("filename=")[1];
          this.fileSaver.save(blob,fileName);
        }
        );
    }
  }

}
