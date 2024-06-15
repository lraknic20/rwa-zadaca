import { Injectable } from '@angular/core';
import { ZanrI } from './ZanrI';
import { ZanroviTMDBI, ZanrTMDBI } from './ZanrTMDBI';
import { environment } from '../../environments/enviornment';
import { KorisnikNeispravanJWT } from '../servisi/auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class ZanroviService {
  restServis?: string = environment.restServis;

  zanrovi = new Array<ZanrI>();
  zanroviTMDB = new Array<ZanrI>();

  constructor(private korisnikNeispravanJWT: KorisnikNeispravanJWT) { }

  async dohvatiZanrove() {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "zanr/", {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`
      }
    });
    if (odgovor.status == 401) {
      this.korisnikNeispravanJWT.preusmjeri();
    }
    if (odgovor.status == 200)
    {
      var k = JSON.parse(await odgovor.text()) as ZanrI;
      this.zanrovi = new Array<ZanrI>();
      this.zanrovi.push(k);
      this.zanrovi = this.zanrovi.flat();
      return this.zanrovi;
    }
    else return null;
  }

  async dohvatiZanroveKojiImajuFilm() {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "zanr/" + "?pocetna=1", {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`
      }
    });
    if (odgovor.status == 200)
    {
      var k = JSON.parse(await odgovor.text()) as ZanrI;
      this.zanrovi = new Array<ZanrI>();
      this.zanrovi.push(k);
      this.zanrovi = this.zanrovi.flat();
      return this.zanrovi;
    }
    else return null;
  }

  async azurirajNaziv(idZanra: number, noviNaziv: string) {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "zanr/" + idZanra, {
      method: 'PUT',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({noviNaziv})
    });
    if (odgovor.status == 200)
    {
      return this.dohvatiZanrove();
    }
    else return null;
  }
  
  async obrisiZanrove() {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "zanr/", {
      method: 'DELETE',
      headers: {
        Authorization: `${jwt}`,
      },
    });
    if (odgovor.status == 200)
    {
      return this.dohvatiZanrove();
    }
    else return null;
  }

  async dohvatiZanroveTMDB(zanroviBaza: Array<ZanrI>) {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "tmdb/zanr/", {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`
      }
    });
    if (odgovor.status == 200)
    {
      var k = JSON.parse(await odgovor.text()) as ZanroviTMDBI;
      this.zanroviTMDB = new Array<ZanrI>();
      for (let zanrTMDB of k.genres) {
        let zanr: ZanrI = {
          id: zanrTMDB.id,
          naziv: zanrTMDB.name
        };
        this.zanroviTMDB.push(zanr);
      }
      return this.usporediZanrove(this.zanroviTMDB, zanroviBaza);
    }
    else return null;
  }

  usporediZanrove(zanroviTMDB: Array<ZanrI>, zanroviBaza: Array<ZanrI>) {
    const preskoceniZanrovi: ZanrI[] = [];
    let counter = 0;
    const delay = 200;
    zanroviTMDB.forEach(zanrTMDB => {
      const zanrBaza = zanroviBaza.find(g => g.id === zanrTMDB.id);
      if (!zanrBaza) {
        zanroviBaza.push(zanrTMDB);
        setTimeout(() => {
          this.dodajZanr(zanrTMDB.id, zanrTMDB.naziv);
        }, delay * counter);
        counter++;
      } else {
        preskoceniZanrovi.push(zanrTMDB);
      }
    });
    return preskoceniZanrovi;
  }
  
  async dodajZanr(id: number, naziv: string) {
    let jwt = localStorage.getItem("jwt");
    let odgovor = await fetch(this.restServis + "zanr", {
      method: 'POST',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, naziv})
    });
    if (odgovor.status == 200)
    {
      return true;
    }
    else return null;
  }
}

