import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ZanrI } from '../servisi/ZanrI';
import { ZanroviService } from '../servisi/zanrovi.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-zanrovi',
  templateUrl: './zanrovi.component.html',
  styleUrls: ['./zanrovi.component.scss']
})
export class ZanroviComponent implements OnInit {
  zanrovi = new Array<ZanrI>();
  preskoceniZanroviPoruka?: string;

  constructor(private zanroviService: ZanroviService, private snackBar: MatSnackBar) {  }

  ngOnInit() {
    this.dohvatiZanrove();
  }

  dohvatiZanrove() {
    this.zanroviService.dohvatiZanrove().then(
      (zanrovi) => {
        if(zanrovi != null) {
          this.zanrovi = zanrovi;
        }
      }
    );
  }

  azurirajNaziv(id: number) {
    let noviNaziv = prompt("Upišite novi naziv žanra:");
    console.log(noviNaziv?.length);
    if(noviNaziv)
    {
      this.zanroviService.azurirajNaziv(id,noviNaziv!).then(
        (zanrovi) => {
          if(zanrovi != null) {
            this.zanrovi = zanrovi;
          }
        }
      );
    }
  }

  obrisiZanrove() {
    this.zanroviService.obrisiZanrove().then(
      (zanrovi) => {
        if(zanrovi != null) {
          this.zanrovi = zanrovi;
        }
      }
    );
  }

  syncTMDB() {
    this.zanroviService.dohvatiZanroveTMDB(this.zanrovi).then(
      (zanrovi) => {
        if(zanrovi != null) {
          this.preskoceniZanroviPoruka = `Preskočeni žanrovi: ${zanrovi.map(g => g.naziv).join(", ")}`;
          this.otvoriSnackBar(`Preskočeni žanrovi: ${zanrovi.map(g => g.naziv).join(", ")}`);
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
