import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { KorisnikI } from '../servisi/KorisnikI';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss']
})
export class RegistracijaComponent {
  porukaGreske?: string;

  constructor(private autentifikacija: AutentifikacijaService, private router: Router, private recaptchaV3Service: ReCaptchaV3Service, private snackBar: MatSnackBar) {}

  registracija(forma: NgForm) {
    var korisnik: KorisnikI = {
      ime: forma.value.ime,
      prezime: forma.value.prezime,
      korime: forma.value.korime,
      email: forma.value.email,
      lozinka: forma.value.lozinka,
      adresa: forma.value.adresa
    }

    if(korisnik.ime!.length < 3)
    {
      this.otvoriSnackBar("Ime mora imati barem 3 znakova.");
      return;
    }
    if(korisnik.prezime!.length < 3)
    {
      this.otvoriSnackBar("Prezime mora imati barem 3 znakova.");
      return;
    }
    if(korisnik.korime!.length < 3)
    {
      this.otvoriSnackBar("Korisničko ime mora imati barem 3 znakova.");
      return;
    }
    if(korisnik.email!.length < 3)
    {
      this.otvoriSnackBar("Unesite ispravan mail");
      return;
    }
    if(korisnik.lozinka!.length < 3)
    {
      this.otvoriSnackBar("Lozinka mora imati barem 3 znakova.");
      return;
    }

    this.recaptchaV3Service.execute('register')
      .subscribe((token: string) => {
        this.autentifikacija.registracija(korisnik, token).then(
          (odgovor) => {
            if(odgovor != null) {
              this.router.navigate(['/prijava']);
            } else{
              this.porukaGreske = "Pogrešno uneseni podaci!";
            }
          },
          (error) => {
            console.error(error);
            this.porukaGreske = "Pogreška kod registracije.";
          }
        );
      });
  }

  otvoriSnackBar(poruka: string) {
    this.snackBar.open(poruka, 'Zatvori', {
      duration: 5000
    });
  }
}
