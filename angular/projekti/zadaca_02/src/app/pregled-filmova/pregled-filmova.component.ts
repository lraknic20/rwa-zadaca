import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilmoviBazaService } from '../servisi/filmovi-baza.service';
import { FilmoviI } from '../servisi/FilmoviI';
import { ZanrI } from '../servisi/ZanrI';
import { environment } from '../../environments/enviornment';
import { DatePipe } from '@angular/common';
import { ZanroviService} from '../servisi/zanrovi.service';

@Component({
  selector: 'app-pregled-filmova',
  templateUrl: './pregled-filmova.component.html',
  styleUrls: ['./pregled-filmova.component.scss']
})
export class PregledFilmovaComponent implements OnInit {

  odobreniFilmovi = new Array<FilmoviI>();
  zanrovi = new Array<ZanrI>();

  posteriPutanja: string = environment.posteriPutanja;
  pipe: any;
  porukaGreske?: string|null;
  stranica?: number = 1;
  ukupnoStranica?: number = 1;
  brojFilmova?: number = 5;
  odabranZanr: number|null = null;

  constructor(private filmoviBazaService:FilmoviBazaService, private zanroviService: ZanroviService){  }

  @Output() prikaziDetaljeFilma = new EventEmitter<number>();

  ngOnInit() {
    this.pipe = new DatePipe('en-US');
    this.prikaziFilmove(1,5);
  }

  prikaziFilmove(stranica: number, brojFilmova: number) {
    this.porukaGreske = null;
    this.filmoviBazaService.dohvatiFilmove(stranica, brojFilmova, this.odabranZanr, 1).then(
      (filmovi) => {
        if (filmovi != null) {
          if(filmovi.length != 0){
            this.odobreniFilmovi = filmovi;
            this.ukupnoStranica = this.filmoviBazaService.filmoviBaza?.odobrenoStranica;
            this.stranica = stranica;
            this.prikaziZanrove();
          }
          else 
            this.porukaGreske = "Ne postoji prijedloga!";
        }
      }
    );
  }

  prikaziZanrove() {
    this.zanroviService.dohvatiZanrove().then(
      (zanrovi) => {
        if (zanrovi != null) {
          if(zanrovi.length != 0){
            this.zanrovi = zanrovi;
          }
        }
      }
    );
  }

  prikaziDetalje(idFilma: number) {
    this.prikaziDetaljeFilma.emit(idFilma);
  }
}