export type LayoutChildren = {
    children: React.ReactNode;
}

export interface Photo {
    albumId?: number;
    id?: number;
    title?: string;
    url?: string;
    thumbnailUrl?: string;
}
