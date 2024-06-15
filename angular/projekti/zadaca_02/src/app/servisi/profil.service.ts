import { Injectable } from '@angular/core';
import { KorisnikI } from './KorisnikI';
import { environment } from '../../environments/enviornment';
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { KorisnikNeispravanJWT } from '../servisi/auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  restServis?: string = environment.restServis;
  korisnik?: KorisnikI;

  constructor(private autentifikacija: AutentifikacijaService, private korisnikNeispravanJWT: KorisnikNeispravanJWT) {  }

  async dohvatiKorisnika(){
    let jwt = localStorage.getItem("jwt");
    let korime = this.autentifikacija.korime;

    let odgovor = await fetch(this.restServis + "korisnici/" + korime, {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`,
      }
    });
    if (odgovor.status == 401) {
      this.korisnikNeispravanJWT.preusmjeri();
    }
    if (odgovor.status == 200)
    {
      var k = JSON.parse(await odgovor.text()) as KorisnikI;
      return k;
    }
    else return null;
  }

  async azurirajKorisnika(korisnik: KorisnikI, recaptcha: string){
    let jwt = localStorage.getItem("jwt");
    let korime = this.autentifikacija.korime;

    let odgovor = await fetch(this.restServis + "korisnici/" + korime, {
      method: 'PUT',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ korisnik, recaptcha })
    });
    if (odgovor.status == 200)
    {
      return true;
    }
    else return null;
  }
}
