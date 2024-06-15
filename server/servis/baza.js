const sqlite3 = require('sqlite3').verbose();

let db;

class Baza {
    spojiSeNaBazu() {
        db = new sqlite3.Database('../baza.sqlite');
        db.exec("PRAGMA foreign_keys = ON;");
    }

    izvrsiUpit(sql, podaciZaSQL, povratnaFunkcija) {
        db.all(sql, podaciZaSQL, povratnaFunkcija);
    }

    izvrsiUpit(sql, podaciZaSQL) {
        return new Promise((uspjeh, neuspjeh) => {
            db.all(sql, podaciZaSQL, (greska, rezultat) => {
                if(greska)
                    neuspjeh(greska);
                else
                    uspjeh(rezultat);
            });
        });
    }

    zatvoriVezu() {
        db.close();
    }
}

module.exports = Baza;