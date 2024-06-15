const Baza = require("./baza.js");

class FilmDAO {

    constructor() {
		this.baza = new Baza();
	}

	daj = async function (idFilma) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [idFilma]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

    dajSve = async function (stranica, brFilmova, odobreno, zanr) {
		const offset = (stranica - 1) * brFilmova;

		var podaci = {};
		this.baza.spojiSeNaBazu();
		if(odobreno == 1) {
			if(zanr == null){
				var sql1 = "SELECT COUNT() FROM film WHERE odobreno = 1;"
				podaci.odobrenoStranica = Math.ceil((await this.baza.izvrsiUpit(sql1, []))[0]['COUNT()'] / brFilmova);
			
				var sql2 = "SELECT * FROM film WHERE odobreno = ? LIMIT ? OFFSET ?"
				podaci.filmovi = await this.baza.izvrsiUpit(sql2, [odobreno, brFilmova, offset]);
			}
			else {
				var sql1 = `SELECT COUNT(f.id) FROM film f
							INNER JOIN film_has_zanr fhz ON f.id = fhz.film_id
							INNER JOIN zanr z ON fhz.zanr_id = z.id
							WHERE z.id = ? AND f.odobreno = 1`;
				
				var sql2 = `SELECT DISTINCT f.* FROM film f
							INNER JOIN film_has_zanr fhz ON f.id = fhz.film_id
							INNER JOIN zanr z ON fhz.zanr_id = z.id
							WHERE z.id = ? AND f.odobreno = ?
							LIMIT ? OFFSET ?`;
				
				podaci.odobrenoStranica = Math.ceil((await this.baza.izvrsiUpit(sql1, [zanr]))[0]['COUNT(f.id)'] / brFilmova);
				podaci.filmovi = await this.baza.izvrsiUpit(sql2, [zanr, odobreno, brFilmova, offset]);
			}
				
		}
		else if(odobreno == 0) {
			var sql1 = "SELECT COUNT() FROM film WHERE odobreno = 0;"
			var sql2 = "SELECT * FROM film WHERE odobreno = ? LIMIT ? OFFSET ?"


			podaci.neodobrenoStranica = Math.ceil((await this.baza.izvrsiUpit(sql1, []))[0]['COUNT()'] / brFilmova);
			podaci.filmovi = await this.baza.izvrsiUpit(sql2, [odobreno, brFilmova, offset]);
		}
		else {
			var sql1 = "SELECT * FROM film"
			podaci.filmovi = await this.baza.izvrsiUpit(sql1, []);
		}
			
		this.baza.zatvoriVezu();
		return podaci;
	}

	/* dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	} */

	dodaj = async function (film) {
		console.log(film)
		let adult = film.odrasli ? 1 : 0;
		let dateOld = new Date().toISOString().slice(0, 19).replace('T', ' ');
		let date = new Date(dateOld);
		date.setHours(date.getHours() + 1);

		this.baza.spojiSeNaBazu();
		let sql = `INSERT or IGNORE INTO film (id, datum_unosa, odobreno, adult, backdrop_path, original_language, original_title, overview, 
			popularity, poster_path, release_date, title, vote_average, vote_count, korisnik_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let podaci = [film.id,date,0,adult,film.pozadina,film.jezik,film.originalni_naslov,film.opis,film.popularnost,
			film.poster,film.datum_izlaska,film.naslov,film.prosjek_glasova,film.broj_glasova,film.korisnik_id];
		//let podaci = [film.id,date,0,adult,film.backdrop_path,film.original_language,film.original_title,film.overview,film.popularity,
			//film.poster_path,film.release_date,film.title,film.vote_averate,film.vote_count,film.idKorisnika];
		await this.baza.izvrsiUpit(sql,podaci);
		for(let i=0;i<film.id_zanrova.length;i++)
		{
			let sql = `INSERT or IGNORE INTO film_has_zanr (film_id, zanr_id) VALUES (?,?)`;
			let podaci = [film.id,film.id_zanrova[i]];
			await this.baza.izvrsiUpit(sql,podaci);
		}
		this.baza.zatvoriVezu();
		return true;
	}

	odobri = async function (idFilma, odobreno) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE film SET odobreno=? WHERE id=?`;
        let podaci = [odobreno, idFilma];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu(); //dodano
		return true;
	}

	izbrisiFilm = async function (idFilma) {
		this.baza.spojiSeNaBazu();

		let sql = `DELETE FROM film_has_zanr WHERE film_id=?`;
        let podaci = [idFilma];
		await this.baza.izvrsiUpit(sql,podaci);

		sql = `DELETE FROM film WHERE id=?`;
        podaci = [idFilma];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu(); //dodano
		return true;
	}
}

module.exports = FilmDAO;