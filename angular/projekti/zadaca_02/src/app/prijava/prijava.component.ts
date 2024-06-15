priuimport { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AutentifikacijaService } from '../servisi/autentifikacija.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})
export class PrijavaComponent {
  korime?: string;
  lozinka?: string;

  porukaGreske?: string;
  korimePoruka?: string;
  lozinkaPoruka?: string;

  constructor(private autentifikacija: AutentifikacijaService, private router: Router, private recaptchaV3Service: ReCaptchaV3Service, private snackBar: MatSnackBar) {}

  prijava() {
    if(this.korime?.length == undefined || this.korime?.length < 3)
    {
      this.korimePoruka = "Korisničko ime mora imati barem 3 znakova.";
      return;
    }
    if(this.lozinka?.length == undefined || this.lozinka?.length < 3)
    {
      this.lozinkaPoruka = "Lozinka mora imati barem 3 znakova.";
      return;
    }

    this.recaptchaV3Service.execute('login')
      .subscribe((token: string) => {

        this.autentifikacija.prijava(this.korime!, this.lozinka!, token).then(
          (odgovor) => {
            if (odgovor != null) {
              localStorage.setItem("jwt", odgovor);
              this.router.navigate(['/']);
            } else {
              this.otvoriSnackBar("Pogrešno korisničko ime ili lozinika!");
            }
          },
          (error) => {
            console.error(error);
            this.porukaGreske = "Pogreška kod prijave.";
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
