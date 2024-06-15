export interface FilmoviBazaI {
    odobrenoStranica: number;
    neodobrenoStranica: number;
    filmovi: Array<FilmBazaI>;
}

export interface FilmBazaI {
    id: number,
    datum_unosa?: string;
    odobreno?: number;
    original_language: string;
    original_title: string;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    korisnik_id?: number;

    adult?: boolean;
    backdrop_path?: string;
    popularity?: number;
    vote_average?: number;
    vote_count?: number;
    genre_ids?: Array<number>;
}