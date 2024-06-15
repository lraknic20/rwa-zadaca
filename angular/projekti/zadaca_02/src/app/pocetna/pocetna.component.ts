import { Component } from '@angular/core';
import { ZanrI } from '../servisi/ZanrI';
import { FilmoviI } from '../servisi/FilmoviI';
import { ZanroviService } from '../servisi/zanrovi.service';
import { FilmoviBazaService } from '../servisi/filmovi-baza.service';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.scss']
})
export class PocetnaComponent{

  zanrovi = new Array<ZanrI>();
  filmovi = new Array<FilmoviI>();

  constructor(private zanroviService: ZanroviService, private filmoviBazaService:FilmoviBazaService) { 
    this.dohvatiZanrove();
  }

  dohvatiZanrove() {
    this.zanroviService.dohvatiZanroveKojiImajuFilm().then(
      (zanrovi) => {
        if(zanrovi != null) {
          this.zanrovi = zanrovi;        
        }
      }
    );
  }

  dohvatiFilmove(idZanra: number) {
    this.filmoviBazaService.dohvatiFilmove(1, 200, idZanra, 1).then(
      (filmovi) => {
        if (filmovi != null) {
          this.filmovi = filmovi;
          console.log(filmovi);
        }
      }
    );
  }

}
