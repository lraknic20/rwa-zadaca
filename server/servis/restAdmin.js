const AdminDAO = require("./adminDAO.js");

exports.getZanrovi = function (zahtjev, odgovor) {
    let zanroviKojiImajuFilm = zahtjev.query.pocetna;
    odgovor.type("application/json")
    let aDao = new AdminDAO();
    if(zanroviKojiImajuFilm == null)
    {
        aDao.dajSve().then((zanr) => {
            odgovor.send(JSON.stringify(zanr));
        });
    }
    else {
        aDao.dajKojiImajuFilmove().then((zanr) => {
            odgovor.send(JSON.stringify(zanr));
        });
    }
}

exports.postZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let podaci = zahtjev.body;
    let aDao = new AdminDAO();
    aDao.dodaj(podaci).then((zanr) => {
        odgovor.send(JSON.stringify(zanr));
    });
}

exports.deleteZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let aDao = new AdminDAO();
    aDao.obrisi().then((zanr) => {
        odgovor.send(JSON.stringify(zanr));
    });
}

exports.getZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let aDao = new AdminDAO();
    let id = zahtjev.params.id;
    aDao.daj(id).then((zanr) => {
        odgovor.send(JSON.stringify(zanr));
    });
}

exports.postZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")

    let zanrId = zahtjev.params.id;
    let noviNaziv = zahtjev.body.noviNaziv;
    //let noviNaziv = zahtjev.query.noviNaziv;

    let adao = new AdminDAO();
    adao.azuriraj(zanrId, noviNaziv).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}

exports.deleteZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zanrId = zahtjev.params.id;
    let aDao = new AdminDAO();
    aDao.obrisiJedan(zanrId).then((zanr) => {
        odgovor.send(JSON.stringify(zanr));
    });
}