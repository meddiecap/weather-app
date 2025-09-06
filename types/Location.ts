export interface Location {
    lat: number | string;
    lon: number | string;
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
    name?: string;
    count: number;
    date_added: number;
}