import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, KorisnikGuard } from './servisi/auth-guard.service';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { ProfilComponent } from './profil/profil.component'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/enviornment';
import { PretrazivanjeFilmovaComponent } from './pretrazivanje-filmova/pretrazivanje-filmova.component';
import { PregledFilmovaComponent } from './pregled-filmova/pregled-filmova.component';
import { ZanroviComponent } from './zanrovi/zanrovi.component';
import { PrijedloziFilmovaComponent } from './prijedlozi-filmova/prijedlozi-filmova.component';
import { FilmComponent } from './film/film.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';

const routes:Routes = [
  {path: "", component:PocetnaComponent},
  {path: "prijava", component:PrijavaComponent},
  {path: "registracija", component:RegistracijaComponent},
  {path: "profil", component:ProfilComponent, canActivate: [KorisnikGuard]},
  {path: "filmoviPretrazivanje", component:PretrazivanjeFilmovaComponent, canActivate: [KorisnikGuard]},
  {path: "filmoviPregled", component:PregledFilmovaComponent, canActivate: [KorisnikGuard]},
  {path: "zanrovi", component:ZanroviComponent, canActivate: [AdminGuard]},
  {path: "filmoviPrijedlozi", component:PrijedloziFilmovaComponent, canActivate: [AdminGuard]},
  {path: "film", component:FilmComponent, canActivate: [KorisnikGuard]},
  {path: "film/:id", component:FilmComponent, canActivate: [KorisnikGuard]},
  {path: "dokumentacija", component:DokumentacijaComponent},
  {path: "", redirectTo:"", pathMatch:"full"}
];

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    ProfilComponent,
    PretrazivanjeFilmovaComponent,
    PregledFilmovaComponent,
    ZanroviComponent,
    PrijedloziFilmovaComponent,
    FilmComponent,
    DokumentacijaComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule
    FormsModule,
    RouterModule.forRoot(routes),
    RecaptchaV3Module,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
