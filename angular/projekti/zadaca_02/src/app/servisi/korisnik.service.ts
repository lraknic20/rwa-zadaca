import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviornment';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {
  restServis?: string = environment.restServis;

  constructor() { }

  async login(korime: string, lozinka: string) {
    let odgovor = await fetch(this.restServis + "/api/korisnici/" + korime + "/prijava", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lozinka }),
    }) as Response;
    if (odgovor.status == 200)
    {
      let k = JSON.parse(await odgovor.text());
      console.log(k);
      return await odgovor;
    }
    else return null;
  }
}
