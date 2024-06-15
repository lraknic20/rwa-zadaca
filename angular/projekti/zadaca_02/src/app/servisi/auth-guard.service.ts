import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutentifikacijaService } from './autentifikacija.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, public autentifikacija: AutentifikacijaService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn() && this.autentifikacija.tipKorisnika == 1) {
      return true;
    } else {
      this.router.navigate(['/prijava']);
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.autentifikacija.prijavljen;
  }
}

@Injectable({
  providedIn: 'root'
})
export class KorisnikGuard implements CanActivate {

  constructor(private router: Router, public autentifikacija: AutentifikacijaService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn() && this.autentifikacija.tipKorisnika == 2 || this.autentifikacija.tipKorisnika == 1) {
      return true;
    } else {
      this.router.navigate(['/prijava']);
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.autentifikacija.prijavljen;
  }
}

@Injectable({
  providedIn: 'root'
})
export class KorisnikNeispravanJWT {
  constructor(private snackBar: MatSnackBar, private router: Router, public autentifikacija: AutentifikacijaService) {}

  preusmjeri() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("tipKorisnika");
    localStorage.removeItem("korime");
    localStorage.removeItem("idKorisnika");
    this.autentifikacija.prijavljen = false;

    this.router.navigate(['/prijava']);
    this.snackBar.open("Potrebna je ponovna prijava", 'Zatvori', {
      duration: 5000
    });
  }
}