import { Component, OnInit } from '@angular/core';
import { FilmoviTMDBService } from '../servisi/filmoviTMDB.service';
import { FilmoviBazaService } from '../servisi/filmovi-baza.service';
import { FilmoviI } from '../servisi/FilmoviI';
import { environment } from '../../environments/enviornment';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pretrazivanje-filmova',
  templateUrl: './pretrazivanje-filmova.component.html',
  styleUrls: ['./pretrazivanje-filmova.component.scss']
})
export class PretrazivanjeFilmovaComponent implements OnInit {
  filmoviTMDB = new Array<FilmoviI>();
  filmoviBaza = new Array<FilmoviI>();
  prikazi: string = "";
  filter: string = "";
  pipe: any;
  stranica?: number = 1;
  ukupnoStranica?: number = 1;

  posteriPutanja: string = environment.posteriPutanja;

  constructor(private filmoviTMDBServis:FilmoviTMDBService, private filmoviBazaService: FilmoviBazaService, private snackBar: MatSnackBar){  }

  ngOnInit(): void {
    this.pipe = new DatePipe('en-US');
    this.dohvatiFilmove(1,"");
  }

  dohvatiFilmove(stranica: number, filter: string){
    this.filmoviTMDBServis.osvjeziFilmove(stranica, filter).then(
      (filmovi) => {
        if(filmovi != null) {
          this.filmoviTMDB = filmovi;
          this.stranica = this.filmoviTMDBServis.filmoviTMDB?.page;
          this.ukupnoStranica = this.filmoviTMDBServis.filmoviTMDB?.total_pages;
        } else {
          this.otvoriSnackBar("Greška pri dohvaćanju filmova!");
        }
      }
    );
    this.filmoviBazaService.dohvatiFilmove(1, 500, null, null).then(
      (filmovi) => {
        if(filmovi != null) {
          this.filmoviBaza = filmovi;
        } else {
          this.otvoriSnackBar("Greška pri dohvaćanju filmova!");
        }
      }
    );
  }

  provjeri(id: number){
    return this.filmoviBaza.some(film => film.id == id)
  }

  dFilmoveDelay(vrijeme: number) {
    setTimeout(() => {
      this.dohvatiFilmove(this.stranica!, this.filter);
    }, vrijeme);
  }

  dodaj(idFilma: number) {
    let film = this.filmoviTMDB.filter(film => film.id == idFilma);
    this.filmoviBazaService.dodajFilm(film[0]).then(
      (poruka) => {
        if(poruka != null) {
          this.dohvatiFilmove(this.stranica!, this.filter);
          this.otvoriSnackBar("Film je dodan");
        } else {
          this.otvoriSnackBar("Film nije dodan");
        }
      }
    );
  }

  otvoriSnackBar(poruka: string) {
    this.snackBar.open(poruka, 'Zatvori', {
      duration: 5000
    });
  }
}
