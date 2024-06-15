import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviornment';
import { KorisnikI } from './KorisnikI';

@Injectable({
  providedIn: 'root'
})
export class AutentifikacijaService {
  restServis?: string = environment.restServis;
  prijavljen = false;
  tipKorisnika: number = 0;
  korime?: string;
  idKorisnika: number = 0;

  constructor() { 
    this.provjeraPrijave();
  }

  async prijava(korime: string, lozinka: string, recaptcha: string) {
    let odgovor = await fetch(this.restServis + "korisnici/" + korime + "/prijava", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lozinka, recaptcha })
    });
    if (odgovor.status == 200)
    {
      this.prijavljen = true;
      let odgovorPrijava = JSON.parse(await odgovor.text());
      this.tipKorisnika = odgovorPrijava.tip_korisnika;
      localStorage.setItem("tipKorisnika", this.tipKorisnika.toString());
      this.idKorisnika = odgovorPrijava.idKorisnika;
      localStorage.setItem("idKorisnika", this.idKorisnika.toString());
      this.korime = odgovorPrijava.korime;
      localStorage.setItem("korime", this.korime!);
      let jwt = odgovorPrijava.jwt.replace(/"/g, '');
      return await jwt;
    }
    else return null;
  }

  async registracija(korisnik: KorisnikI, recaptcha: string) {

    let odgovor = await fetch(this.restServis + "korisnici", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({korisnik, recaptcha}),
    });
    if (odgovor.status == 200)
    {
      return true;
    }
    else return null;
  }

  provjeraPrijave() {
    if(localStorage.getItem("jwt"))
    {
      this.prijavljen = true;
    }
    if(localStorage.getItem("tipKorisnika"))
    {
      this.tipKorisnika = Number(localStorage.getItem("tipKorisnika")!);
    }
    if(localStorage.getItem("korime"))
    {
      this.korime = localStorage.getItem("korime")!;
    }
  }
}
