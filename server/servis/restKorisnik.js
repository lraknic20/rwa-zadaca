const KorisnikDAO = require("./korisnikDAO.js");
const kodovi = require("./moduli/kodovi.js");
const jwt = require("./moduli/jwt.js");

exports.getKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    kdao.dajSve().then((korisnici) => {
        console.log(korisnici);
        odgovor.send(JSON.stringify(korisnici));
    });
}

exports.postKorisnici = function (zahtjev, odgovor) {
    try{
        odgovor.type("application/json")
        let korisnik = zahtjev.body.korisnik;

        provjeriRecaptchu(zahtjev.body.recaptcha).then((odgovorRecaptcha) => {
            if (odgovorRecaptcha) {
                korisnik.lozinka = kodovi.kreirajSHA256(korisnik.lozinka, "moja sol");
                let kdao = new KorisnikDAO();
                kdao.dodaj(korisnik).then((poruka) => {
                    odgovor.send(JSON.stringify(poruka));
                });
            } else {
                odgovor.status(422)
                odgovor.send(JSON.stringify({ greska: "reCAPTCHA validacija nije prošla!" }))
            }
        });
    } catch (error){
        odgovor.send("Greska pri dodavanju. Error: "+error);
    }
}

exports.deleteKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        console.log(korisnik);
        odgovor.send(JSON.stringify(korisnik));
    });
}

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    let lozinka = kodovi.kreirajSHA256(zahtjev.body.lozinka, "moja sol");
    provjeriRecaptchu(zahtjev.body.recaptcha).then((odgovorRecaptcha) => {
        if (odgovorRecaptcha) {
            kdao.daj(korime).then((korisnik) => {
                console.log(korisnik);
                //console.log(lozinka);
                if (korisnik != null && korisnik.lozinka == lozinka) {
                    let token = jwt.kreirajToken(korisnik);
                    //odgovor.send(JSON.stringify(korisnik));
                    let vrati = {
                        jwt: JSON.stringify(token),
                        tip_korisnika: korisnik.tip_korisnika_id,
                        korime: korisnik.korime,
                        idKorisnika: korisnik.id
                    }
                    odgovor.send(vrati);
                    //odgovor.send(JSON.stringify(token));
                } else {
                    odgovor.status(401)
                    odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }))
                    console.log("Krivi podaci!");;
                }
            });
        } else {
            odgovor.status(422)
            odgovor.send(JSON.stringify({ greska: "reCAPTCHA validacija nije prošla!" }))
        }
    });
        
}

exports.putAktivirajKorisnika = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    
    let korime = zahtjev.params.korime;
    let kod = zahtjev.body.aktivacijskiKod;

    kdao.aktiviraj(korime, kod).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}

exports.postAktivirajKorisnika = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.postKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnik = function (zahtjev, odgovor) {
    console.log("Azuriranje korisnika");
    odgovor.type("application/json")

    let korime = zahtjev.params.korime;
    let korisnik = zahtjev.body.korisnik;

    console.log(korime);
    console.log(korisnik);

    provjeriRecaptchu(zahtjev.body.recaptcha).then((odgovorRecaptcha) => {
        if (odgovorRecaptcha)
        {
            let kdao = new KorisnikDAO();
            kdao.azuriraj(korime, korisnik).then((poruka) => {
                odgovor.send(JSON.stringify(poruka));
            });
        } else {
            odgovor.status(422)
            odgovor.send(JSON.stringify({ greska: "reCAPTCHA validacija nije prošla!" }))
        }
    });
}

exports.deleteKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

async function provjeriRecaptchu(token) {
    console.log(token);
    let parametri = { method: 'POST' }
    /* let o = await fetch("https://www.google.com/recaptcha/api/siteverify?secret="
        + konf.tajniKljucCaptcha + "&response=" + token, parametri); */
    let o = await fetch("https://www.google.com/recaptcha/api/siteverify?secret="
        + "6LdlmMYjAAAAAJj9qDm1UqJYY8ZcesLnYd0FWq45" + "&response=" + token, parametri);
    let recaptchaStatus = JSON.parse(await o.text());
    console.log(recaptchaStatus);
    if (recaptchaStatus.success && recaptchaStatus.score > 0.5)
        return true;
    return false;
}