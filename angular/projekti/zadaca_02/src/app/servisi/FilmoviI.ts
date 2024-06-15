import { ZanrI } from './ZanrI';

export interface FilmoviI {
    id: number,
    jezik: string,
    originalni_naslov: string,
    naslov: string;
    opis: string;
    poster: string;
    datum_izlaska: string;
    datum_unosa?: string;
    korisnik_id?: number;
    odobreno?: number;

    odrasli?: boolean;
    pozadina?: string;
    popularnost?: number;
    prosjek_glasova?: number;
    broj_glasova?: number;
    id_zanrova?: Array<number>;
    zanrovi?: Array<ZanrI>;
}