const konst = require("../konstante.js");
const express = require(konst.dirModula + 'express');
const Konfiguracija = require("../konfiguracija");
const restKorisnik = require("./restKorisnik.js")
const RestTMDB = require("./restTMDB.js")
const restAdmin = require("./restAdmin.js")
const restFilmovi = require("./restFilmovi.js")
const cors = require(konst.dirModula + 'cors')
const jwt = require("./moduli/jwt.js");
const server = express();

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju().then(pokreniServer).catch((greska) => {
    if(process.argv.length == 2){
        console.error("Potrebno je dati naziv datoteke")
    } else{
        console.error("Nije moguće otvoriti datoteku: "+greska.path);
    }
    process.exit();
});

function pokreniServer() {
    const port = konf.dajKonf()["rest.port"];

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(cors());

    pripremiPutanjeKorisnici();
    pripremiPutanjeTMDB();
    pripremiPutanjeFilmovi();
    pripremiPutanjeAdmin();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = {"greska" : "Stranica nije pronađena!"} ;
        odgovor.send(poruka);
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeTMDB(){
    let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
    server.get("/api/tmdb/zanr", provjeriJWT, restTMDB.getZanr.bind(restTMDB));
    server.get("/api/tmdb/filmovi", provjeriJWT, restTMDB.getFilmovi.bind(restTMDB));
}

function pripremiPutanjeFilmovi(){
    server.get("/api/filmovi", provjeriJWT, restFilmovi.getFilmovi);
    server.post("/api/filmovi", provjeriJWT, restFilmovi.postFilmovi);

    server.get("/api/filmovi/:id", provjeriJWT, restFilmovi.getFilm);
    server.post("/api/filmovi/:id", provjeriJWT, restFilmovi.postFilm);
    server.put("/api/filmovi/:id", provjeriJWT, restFilmovi.putFilm);
    server.delete("/api/filmovi/:id", provjeriJWT, restFilmovi.deleteFilm);
}

function pripremiPutanjeAdmin(){
    server.get("/api/zanr", provjeriJWT, restAdmin.getZanrovi);
    server.post("/api/zanr", provjeriJWT, restAdmin.postZanrovi);
    server.delete("/api/zanr", provjeriJWT, restAdmin.deleteZanrovi);

    server.get("/api/zanr/:id", provjeriJWT, restAdmin.getZanr);
    server.post("/api/zanr/:id", provjeriJWT, restAdmin.postZanr);
    server.put("/api/zanr/:id", provjeriJWT, restAdmin.putZanr);
    server.delete("/api/zanr/:id", provjeriJWT, restAdmin.deleteZanr);
}

function pripremiPutanjeKorisnici(){
    server.get("/api/korisnici", provjeriJWT, restKorisnik.getKorisnici);
    server.post("/api/korisnici", restKorisnik.postKorisnici);
    server.put("/api/korisnici",restKorisnik.putKorisnici);
    server.delete("/api/korisnici",restKorisnik.deleteKorisnici);

    server.get("/api/korisnici/:korime", provjeriJWT, restKorisnik.getKorisnik);
    server.post("/api/korisnici/:korime", provjeriJWT, restKorisnik.postKorisnik);
    server.put("/api/korisnici/:korime", provjeriJWT, restKorisnik.putKorisnik);
    server.delete("/api/korisnici/:korime",restKorisnik.deleteKorisnici);
    server.post("/api/korisnici/:korime/prijava",restKorisnik.getKorisnikPrijava);
    server.post("/api/korisnici/:korime/aktivacija",restKorisnik.postAktivirajKorisnika);
    server.put("/api/korisnici/:korime/aktivacija",restKorisnik.putAktivirajKorisnika);
}

function provjeriJWT(zahtjev, odgovor, next) {
    if (!zahtjev.headers.authorization) {
        return odgovor.sendStatus(401);
    }

    try {
        const provjeraJWT = jwt.provjeriToken(zahtjev);

        if (!provjeraJWT)
            return odgovor.sendStatus(401);
        else
            next();
    } catch (error) {
        return odgovor.sendStatus(401);
    }
}