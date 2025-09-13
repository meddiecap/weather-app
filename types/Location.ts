export interface Location {
    id: number;
    lat: number | string;
    lon: number | string;
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    timezone?: string;
    name?: string;
    count: number;
    date_added: number;
}