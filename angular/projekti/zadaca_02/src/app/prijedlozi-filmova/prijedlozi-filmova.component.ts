import { Component, OnInit } from '@angular/core';
import { FilmoviBazaService } from '../servisi/filmovi-baza.service';
import { FilmoviI } from '../servisi/FilmoviI';
import { environment } from '../../environments/enviornment';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prijedlozi-filmova',
  templateUrl: './prijedlozi-filmova.component.html',
  styleUrls: ['./prijedlozi-filmova.component.scss']
})
export class PrijedloziFilmovaComponent implements OnInit {
  neodobreniFilmovi = new Array<FilmoviI>();

  posteriPutanja: string = environment.posteriPutanja;
  pipe: any;
  porukaGreske?: string;
  stranica?: number = 1;
  ukupnoStranica?: number = 1;
  brojFilmova?: number = 5;

  constructor(private filmoviBazaService:FilmoviBazaService, private snackBar: MatSnackBar){  }

  ngOnInit() {
    this.pipe = new DatePipe('en-US');
    this.prikaziFilmove(1,5);
  }

  prikaziFilmove(stranica: number, brojFilmova: number) {
    this.filmoviBazaService.dohvatiFilmove(stranica, brojFilmova, null, 0).then(
      (filmovi) => {
        if(filmovi != null) {
          if(filmovi.length != 0){
            console.log(filmovi);
            this.neodobreniFilmovi = filmovi;
            this.ukupnoStranica = this.filmoviBazaService.filmoviBaza?.neodobrenoStranica;
            this.stranica = stranica;
          }
          else 
            this.porukaGreske = "Ne postoji prijedloga!";
        }
      }
    );
  }

  odobri(id: number) {
    this.filmoviBazaService.odobriFilm(id).then(
      (filmovi) => {
        if(filmovi != null) {
          this.prikaziFilmove(1, this.brojFilmova!);
          this.otvoriSnackBar("Film je odobren");
        }
      }
    );
  }

  izbrisi(id: number) {
    this.filmoviBazaService.izbrisiFilm(id).then(
      (filmovi) => {
        if(filmovi != null) {
          this.prikaziFilmove(1, this.brojFilmova!);
          this.otvoriSnackBar("Film je izbrisan");
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
