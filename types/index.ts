import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

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
