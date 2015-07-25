import fetch from 'isomorphic-fetch';

export interface PlaceInfo {
    countryCode: string;
    placeName: string;
    adminName1: string;
    adminName2: string;
    adminName3: string;
    lat: number;
    lng: number;
}

interface PlaceInfoResponse {
    postalCodes: PlaceInfo[];
}

export async function lookupPlaceByName(name: string): Promise<PlaceInfo[]> {
    const API_USERNAME = 'robertknight';
    const API_ENDPOINT = 'http://api.geonames.org/postalCodeSearchJSON'
    let searchResponse = await fetch(`${API_ENDPOINT}?placename=${name}&username=${API_USERNAME}&maxRows=1`);
    let placesJSON: PlaceInfoResponse = await searchResponse.json();
    return placesJSON.postalCodes;
}
