import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviornment';
import { FilmoviI } from './FilmoviI';
import { FilmoviBazaI, FilmBazaI } from './FilmoviBazaI';
import { KorisnikI } from './KorisnikI';
import { KorisnikNeispravanJWT } from '../servisi/auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class FilmoviBazaService {
  restServis?: string = environment.restServis;
  filmoviBaza?: FilmoviBazaI;
  odobreniFilmovi = new Array<FilmoviI>();
  neodobreniFilmovi = new Array<FilmoviI>();

  ukupnoStranica?: number;

  constructor(private korisnikNeispravanJWT: KorisnikNeispravanJWT) {  }

  async dohvatiFilmove(stranica: number, brojFilmova: number, zanr:number|null, odobreno: number|null) {
    let jwt = localStorage.getItem("jwt");

    if(odobreno == 1 && zanr != null)
      var parametri = "?stranica=" + stranica + "&brojFilmova=" + brojFilmova + "&zanr=" + zanr + "&odobreno=" + odobreno;
    else if(odobreno == 1)
      var parametri = "?stranica=" + stranica + "&brojFilmova=" + brojFilmova + "&odobreno=" + odobreno;
    else if(odobreno == 0)
      var parametri = "?stranica=" + stranica + "&brojFilmova=" + brojFilmova + "&odobreno=" + odobreno;
    else 
      var parametri = "?stranica=" + stranica + "&brojFilmova=" + brojFilmova;
    
      let o = await fetch(this.restServis + "filmovi" + parametri, {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      }
    });
    if (o.status == 401) {
      this.korisnikNeispravanJWT.preusmjeri();
    }
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as FilmoviBazaI;
      this.filmoviBaza = r;
      
      console.log(this.filmoviBaza);

      this.odobreniFilmovi = new Array<FilmoviI>();
        for (let filmBaza of this.filmoviBaza.filmovi) {
          let film: FilmoviI = {
            id: filmBaza.id,
            jezik: filmBaza.original_language,
            originalni_naslov: filmBaza.original_title,
            naslov: filmBaza.original_title,
            opis: filmBaza.overview,
            poster: filmBaza.poster_path,
            datum_izlaska: filmBaza.release_date,
            datum_unosa: filmBaza.datum_unosa,
            odobreno: filmBaza.odobreno,
            korisnik_id: filmBaza.korisnik_id,
            odrasli: filmBaza.adult,
            pozadina: filmBaza.backdrop_path,
            popularnost: filmBaza.popularity,
            prosjek_glasova: filmBaza.vote_average,
            broj_glasova: filmBaza.vote_count,
          };
          this.odobreniFilmovi.push(film);
        }

      return this.odobreniFilmovi;
    }
    return null;
  }

  async dajFilm(id: number) {
    let jwt = localStorage.getItem("jwt");

    let odgovor = await fetch(this.restServis + "filmovi/" + id, {
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
      let filmBaza = JSON.parse(await odgovor.text()) as FilmBazaI;

      if(filmBaza)
      {
        let film: FilmoviI = {
          id: filmBaza.id,
          jezik: filmBaza.original_language,
          originalni_naslov: filmBaza.original_title,
          naslov: filmBaza.original_title,
          opis: filmBaza.overview,
          poster: filmBaza.poster_path,
          datum_izlaska: filmBaza.release_date,
          datum_unosa: filmBaza.datum_unosa,
          odobreno: filmBaza.odobreno,
          korisnik_id: filmBaza.korisnik_id,
          odrasli: filmBaza.adult,
          pozadina: filmBaza.backdrop_path,
          popularnost: filmBaza.popularity,
          prosjek_glasova: filmBaza.vote_average,
          broj_glasova: filmBaza.vote_count,
        };

        return film;
      }
      return null;
    }
    else return null;
  }

  async dajKorime(idKorisnika?: number) {
    let jwt = localStorage.getItem("jwt");

    let odgovor = await fetch(this.restServis + "korisnici", {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`,
      }
    });
    if (odgovor.status == 200)
    {
      var korisnici = new Array<KorisnikI>
      korisnici = JSON.parse(await odgovor.text());
      var korisnik = korisnici.find(korisnik => korisnik.id == idKorisnika);

      return korisnik ? korisnik.korime : null;
    }
    else return null;
  }

  async dodajFilm(film: FilmoviI) {
    let jwt = localStorage.getItem("jwt");

    film.korisnik_id = Number(localStorage.getItem("idKorisnika"));

    let odgovor = await fetch(this.restServis + "filmovi", {
      method: 'POST',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(film)
    });
    if (odgovor.status == 200)
    {
      return true;
    }
    else return null;
  }

  async odobriFilm(id: number)
  {
    let jwt = localStorage.getItem("jwt");

    let odgovor = await fetch(this.restServis + "filmovi/" + id + "?odobreno=" + 1, {
      method: 'PUT',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
    });
    if (odgovor.status == 200)
    {
      return true;
    }
    else return false;
  }

  async izbrisiFilm(id: number)
  {
    let jwt = localStorage.getItem("jwt");

    let odgovor = await fetch(this.restServis + "filmovi/" + id, {
      method: 'DELETE',
      headers: {
        Authorization: `${jwt}`,
        'Content-Type': 'application/json'
      },
    });
    if (odgovor.status == 200)
    {
      return true;
    } else return null;
  }
}
