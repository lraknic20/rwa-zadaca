const Baza = require("./baza.js");

class AdminDAO {

    constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	dajKojiImajuFilmove = async function () {
		this.baza.spojiSeNaBazu();
		let sql = `SELECT DISTINCT zanr.*
					FROM zanr
					JOIN film_has_zanr
					ON zanr.id = film_has_zanr.zanr_id
					WHERE (SELECT COUNT(*) FROM film_has_zanr WHERE zanr_id = zanr.id) >= 2;`;
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	dodaj = async function (zanr) {
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO zanr (id,naziv) VALUES (?,?)`;
        let podaci = [zanr.id,zanr.naziv];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	daj = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	obrisi = async function () {
		this.baza.spojiSeNaBazu();

		let sql = `DELETE FROM zanr
					WHERE NOT EXISTS (
						SELECT 1
						FROM film_has_zanr
						WHERE film_has_zanr.zanr_id = zanr.id
					);`;
		await this.baza.izvrsiUpit(sql);
		this.baza.zatvoriVezu();

		return true;
	}

	obrisiJedan = async function (idZanra) {
		this.baza.spojiSeNaBazu();

		let sql = `DELETE FROM zanr WHERE id=?`;
		let podaci = [idZanra];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();

		return true;
	}

	azuriraj = async function (idZanra, noviNaziv) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE zanr SET naziv=? WHERE id=?`;
        let podaci = [noviNaziv, idZanra];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = AdminDAO;