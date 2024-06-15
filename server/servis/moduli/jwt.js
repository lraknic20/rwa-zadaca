const konst= require("../../konstante.js");
const jwt = require(konst.dirModula + "jsonwebtoken")

exports.kreirajToken = function(korisnikObjekt){
	let token = jwt.sign({ korime: korisnikObjekt.korime, id: korisnikObjekt.id, tipKorisnika: korisnikObjekt.tip_korisnika_id }, 
		konst.tajniKljucJWT, { expiresIn: "60min" });
	console.log(token);
    return token;
}

exports.provjeriToken = function(zahtjev) {
	//console.log("Provjera tokena: "+zahtjev.headers.authorization);
    if (zahtjev.headers.authorization != null) {
        //console.log(zahtjev.headers.authorization);
        let token = zahtjev.headers.authorization;
        try {
            let podaci = jwt.verify(token, konst.tajniKljucJWT);
            //console.log("JWT podaci: "+podaci);
			return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    return false;
}

exports.ispisiDijelove = function(token){
	let dijelovi = token.split(".");
	let zaglavlje =  dekodirajBase64(dijelovi[0]);
	console.log(zaglavlje);
	let tijelo =  dekodirajBase64(dijelovi[1]);
	console.log(tijelo);
	let potpis =  dekodirajBase64(dijelovi[2]);
	console.log(potpis);
}

exports.vratiKorime = function(token){
	try {
		let dijelovi = token.split(".");
		let tijelo =  dekodirajBase64(dijelovi[1]);
		let tijeloObjekt = JSON.parse(tijelo);
		let korime = tijeloObjekt.korime
		return korime;
	} catch (e) {
		console.log(e)
	}
}

exports.vratiTipKorisnika = function(token){
	try {
		let dijelovi = token.split(".");
		let tijelo =  dekodirajBase64(dijelovi[1]);
		let tijeloObjekt = JSON.parse(tijelo);
		let tipKorisnika = tijeloObjekt.tipKorisnika;
		return tipKorisnika;
	} catch (e) {
		console.log(e)
	}
}

exports.vratiId = function(token){
	try {
		let dijelovi = token.split(".");
		let tijelo =  dekodirajBase64(dijelovi[1]);
		let tijeloObjekt = JSON.parse(tijelo);
		let id = tijeloObjekt.id;
		return id;
	} catch (e) {
		console.log(e)
	}
}

exports.dajTijelo = function(token){
	let dijelovi = token.split(".");
	return JSON.parse(dekodirajBase64(dijelovi[1]));
}

function dekodirajBase64(data){
	let buff = new Buffer(data, 'base64');
	return buff.toString('ascii');
}