import { Component } from '@angular/core';
import { AutentifikacijaService } from './servisi/autentifikacija.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zadaca_02';
  constructor(public autentifikacija: AutentifikacijaService) {}

  odjava() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("tipKorisnika");
    localStorage.removeItem("korime");
    localStorage.removeItem("idKorisnika");
    this.autentifikacija.prijavljen = false;
  }
}
