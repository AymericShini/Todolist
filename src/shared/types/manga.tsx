export interface Manga {
    url: string;
    name: string;
    chapitre: string;
    favorite: boolean;
    notifications: boolean;
}

export interface EditManga {
    url: string;
    name: string;
    chapitre: string;
    index: number;
}