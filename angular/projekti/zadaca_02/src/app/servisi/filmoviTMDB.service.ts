import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviornment';
import { FilmoviI } from './FilmoviI';
import { FilmoviTmdbI, FilmTmdbI } from './FilmoviTmdbI';
import { KorisnikNeispravanJWT } from '../servisi/auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class FilmoviTMDBService {
  restServis?: string = environment.restServis;
  filmoviTMDB?: FilmoviTmdbI;
  filmovi = new Array<FilmoviI>();

  constructor(private korisnikNeispravanJWT: KorisnikNispravanJWT) {  }

  async osvjeziFilmove(stranica: number, kljucnaRijec: string) {
    let jwt = localStorage.getItem("jwt");
    let parametri = "?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec;
    let o = await fetch(this.restServis + "tmdb/filmovi" + parametri, {
      method: 'GET',
      headers: {
        Authorization: `${jwt}`,
      }
    });
    if (o.status == 401) {
      this.korisnikNeispravanJWT.preusmjeri();
    }
    if (o.status == 200) {
      let r = JSON.parse(await o.text()) as FilmoviTmdbI;
      console.log(r);
      this.filmoviTMDB = r;

      this.filmovi = new Array<FilmoviI>();
      for (let filmTMDB of this.filmoviTMDB.results) {
        let film: FilmoviI = {
          id: filmTMDB.id,
          jezik: filmTMDB.original_language,
          originalni_naslov: filmTMDB.original_title,
          naslov: filmTMDB.original_title,
          opis: filmTMDB.overview,
          poster: filmTMDB.poster_path,
          datum_izlaska: filmTMDB.release_date,
          odrasli: filmTMDB.adult,
          pozadina: filmTMDB.backdrop_path,
          popularnost: filmTMDB.popularity,
          prosjek_glasova: filmTMDB.vote_average,
          broj_glasova: filmTMDB.vote_count,
          id_zanrova: filmTMDB.genre_ids
        };
        this.filmovi.push(film);
      }
      return this.filmovi;
    } else return null;
  }

  dajFilmove(): Array<FilmoviI> {
    if (this.filmovi.length == 0) {
      if (this.filmoviTMDB == undefined) {
        return new Array<FilmoviI>();
      } else if (this.filmoviTMDB.results.length == 0) {
        return new Array<FilmoviI>();
      } else {
        this.filmovi = new Array<FilmoviI>();
        for (let filmTMDB of this.filmoviTMDB.results) {
          let film: FilmoviI = {
            id: filmTMDB.id,
            jezik: filmTMDB.original_language,
            originalni_naslov: filmTMDB.original_title,
            naslov: filmTMDB.original_title,
            opis: filmTMDB.overview,
            poster: filmTMDB.poster_path,
            datum_izlaska: filmTMDB.release_date,
            odrasli: filmTMDB.adult,
            pozadina: filmTMDB.backdrop_path,
            popularnost: filmTMDB.popularity,
            prosjek_glasova: filmTMDB.vote_average,
            broj_glasova: filmTMDB.vote_count,
            id_zanrova: filmTMDB.genre_ids
          };
          this.filmovi.push(film);
        }
        return this.filmovi;
      }
    } else {
      return this.filmovi;
    }
  }
}