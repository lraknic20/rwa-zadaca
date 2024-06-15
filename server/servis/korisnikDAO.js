const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,adresa,tip_korisnika_id) VALUES (?,?,?,?,?,?,?)`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korisnik.korime,korisnik.adresa,2];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	aktiviraj = async function (korime,kod) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET aktiviran=? WHERE korime=? AND aktivacijski_kod=?`;
        let podaci = [1,korime,kod];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET ime=?, prezime=?, adresa=? WHERE korime=?`;
        let podaci = [korisnik.ime,korisnik.prezime,korisnik.adresa,korime];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = KorisnikDAO;