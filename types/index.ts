import { ObjectId } from 'mongoose';
import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface Anime {
    _id: ObjectId;
    anime_id: number;
    Name: string;
    Score: number;
    Genres: string[];
    Synopsis: string;
    Type: string;
    Episodes: number;
    Aired: string;
    Premiered: string;
    Status: string;
    Producers: string[];
    Licensors: string[];
    Studios: string[];
    Source: string;
    Duration: string;
    Rating: string;
    Rank: number;
    Popularity: number;
    Favorites: number;
    Members: number;
    image_url: string;
    trailer_url?: string | null;
    characters?: Character[];
    staff?: Staff[];
    reviews?: Review[];
    streamingEpisodes?: StreamingEpisode[];
}

export interface StreamingEpisode {
    title: string;
    thumbnail: string;
    url: string;
    site: string;
}

export interface Character {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: {
        large: string;
        medium?: string;
    };
    role: string;
}

export interface Review {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    score: number;
    summary: string;
    body: string;
}

interface Staff {
    id: number;
    name: {
        full: string;
        native?: string;
    };
    image: {
        large: string;
    };
    role: string;
}
