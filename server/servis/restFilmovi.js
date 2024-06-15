const FilmDAO = require("./filmDAO.js");

exports.getFilmovi = function (zahtjev, odgovor) {
    let stranica = zahtjev.query.stranica;
    let brojFilmova = zahtjev.query.brojFilmova;
    let odobreno = zahtjev.query.odobreno;
    let zanr = zahtjev.query.zanr;

    odgovor.type("application/json")
    let fDao = new FilmDAO();
    fDao.dajSve(stranica, brojFilmova, odobreno, zanr).then((film) => {
        odgovor.send(JSON.stringify(film));
    });
}

/* exports.getFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fDao = new FilmDAO();
    fDao.dajSve().then((film) => {
        odgovor.send(JSON.stringify(film));
    });
} */

exports.getFilm = function (zahtjev, odgovor) {
    let idFilma = zahtjev.params.id;
    odgovor.type("application/json")
    let fDao = new FilmDAO();
    fDao.daj(idFilma).then((film) => {
        odgovor.send(JSON.stringify(film));
    });
}

exports.postFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.postFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let podaci = zahtjev.body;
    //console.log(podaci);
    let fDao = new FilmDAO();
    fDao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}

exports.putFilm = function (zahtjev, odgovor) {
    let idFilma = zahtjev.params.id;
    let odobreno = zahtjev.query.odobreno;

    odgovor.type("application/json")
    let fDao = new FilmDAO();
    fDao.odobri(idFilma, odobreno).then((film) => {
        odgovor.send(JSON.stringify(film));
    });
}

exports.deleteFilm = function (zahtjev, odgovor) {
    let idFilma = zahtjev.params.id;

    odgovor.type("application/json")
    let fDao = new FilmDAO();
    fDao.izbrisiFilm(idFilma).then((film) => {
        odgovor.send(JSON.stringify(film));
    });
}