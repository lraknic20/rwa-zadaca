import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { KorisnikI } from '../servisi/KorisnikI';
import { ProfilService} from '../servisi/profil.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  korisnik: KorisnikI = {};
  poruka?: string;

  constructor(private profil: ProfilService, private recaptchaV3Service: ReCaptchaV3Service, private snackBar: MatSnackBar) {  }

  ngOnInit() {
    this.profil.dohvatiKorisnika().then(
      (korisnik) => {
        if(korisnik != null) {
          this.korisnik = korisnik;
        }
      }
    );
  }

  otvoriSnackBar() {
    this.snackBar.open('Profil je ažuriran', 'Zatvori', {
      duration: 5000
    });
  }

  azuriranje(forma: NgForm) {
    var korisnik: KorisnikI = {
      ime: forma.value.ime,
      prezime: forma.value.prezime,
      lozinka: forma.value.lozinka,
      adresa: forma.value.adresa
    }
    
    this.recaptchaV3Service.execute('update')
      .subscribe((token: string) => {
        this.profil.azurirajKorisnika(korisnik, token).then(
          (odgovor) => {
            if(odgovor == true) {
              this.otvoriSnackBar();
            } else{
              this.poruka = "Pogrešno uneseni podaci!";
            }
          },
          (error) => {
            console.error(error);
            this.poruka = "Pogreška kod ažuriranja korisnika.";
          }
        );
      });
  }
}
