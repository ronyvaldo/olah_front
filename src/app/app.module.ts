import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateModule } from './template/template.module';
import { NgChartsModule } from 'ng2-charts';

import { GraficosModule } from './graficos/graficos.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { HomeComponent } from './home/home.component';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosService } from './services/usuarios.service';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { TokenInterceptor } from './token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContribuicoesService } from './services/contribuicoes.service';
import { ContribuicoesModule } from './contribuicoes/contribuicoes.module';
import { DespesasModule } from './despesas/despesas.module';
import { DespesasService } from './services/despesas.service';

//Login Social
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

import { NgxMaskModule } from 'ngx-mask';
import { ProfileComponent } from './profile/profile.component';
import { IgrejasModule } from './igrejas/igrejas.module';
import { EventosModule } from './eventos/eventos.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CadastrarEventoModule } from './eventos/cadastrar-evento/cadastrar-evento.module';
import { CalendarioModule } from './calendario/calendario.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GruposCongregacionaisModule } from './grupos-congregacionais/grupos-congregacionais.module';
import { TipoContribuicaoModule } from './contribuicoes/tipo-contribuicao/tipo-contribuicao.module';
import { RelatoriosModule } from './relatorios/relatorios.module';


registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TemplateModule,
    UsuariosModule,
    ContribuicoesModule,
    DespesasModule,
    GraficosModule,
    IgrejasModule,
    EventosModule,
    CadastrarEventoModule,
    CalendarioModule,
    GruposCongregacionaisModule,
    TipoContribuicaoModule,
    RelatoriosModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatTableModule,
    NgChartsModule,
    AutocompleteLibModule,
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    FullCalendarModule
  ],
  providers: [
    UsuariosService,
    ContribuicoesService,
    DespesasService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '48294022554-ognudccpa9f10a1ru22n2utns598k20r.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('255315523245893')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: LOCALE_ID, useValue: 'pt' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
