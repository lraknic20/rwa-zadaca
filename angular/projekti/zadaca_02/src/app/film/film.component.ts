import { Component, OnInit } from '@angular/core';
import { FilmoviI } from '../servisi/FilmoviI';
import { FilmoviBazaService } from '../servisi/filmovi-baza.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/enviornment';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit{

  film?: FilmoviI | null;
  posteriPutanja: string = environment.posteriPutanja;
  pipe: any;
  porukaGreske?: string;
  korimeDodao?: string;

  constructor(private filmoviBazaService:FilmoviBazaService, private activatedRoute: ActivatedRoute, private location: Location){  }

  ngOnInit() {
    this.pipe = new DatePipe('en-US');
    this.activatedRoute.paramMap.subscribe(parametri => {
      let id = Number(parametri.get("id"));
      if(id != null){
        this.prikaziFilm(id);
      }
    });
  }

  prikaziFilm(id: number) {
    this.filmoviBazaService.dajFilm(id).then(
      (film) => {
        if(film != null) {
          this.film = film;
          this.filmoviBazaService.dajKorime(this.film?.korisnik_id).then(
            (korime) => {
              if(korime != null) {
                this.korimeDodao = korime;
              }
            }
          );
        } else {
          this.porukaGreske = "Film ne postoji!";
        }
      }
    );
  }

  prikaziGresku(){
    this.porukaGreske = "Film ne postoji!";
  }

  nazad() {
    this.location.back();
  }
}
