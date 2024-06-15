const konst= require("../konstante.js");
const express = require(konst.dirModula + 'express');
const sesija = require(konst.dirModula+'express-session')
const kolacici = require(konst.dirModula+'cookie-parser')
const Konfiguracija = require("../konfiguracija");
const server = express();

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju().then(pokreniServer).catch((greska) => {
    if (process.argv.length == 2)
        console.error("Potrebno je dati naziv datoteke");
    else
        console.error("Nije moguće otvoriti datoteku: " + greska.path);
    process.exit()
});

function pokreniServer() {

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    
    server.use("/", express.static("./angular"));
    const port = konf.dajKonf()["app.port"];

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "Stranica nije pronađena!" };
        odgovor.send(JSON.stringify(poruka));
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}