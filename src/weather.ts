import fetch from 'isomorphic-fetch';

// ip-api.com location query response.
// See http://ip-api.com/docs/api:json
export interface IpLocationInfo {
    as: string;
    city: string;
    country: string;
    countryCode: string;
    lat: number;
    lon: number;
    org: string;
    query: string;
    region: string;
    regionName: string;
    status: string;
    timezone: string;
    zip: string;
}

// seconds since UNIX epoch
type UNIXTimestamp = number;

// subset of OpenWeatherMap API
// see http://openweathermap.org/forecast5#JSON
export module OpenWeatherMap {
    export interface ForecastResponse {
        city: Object;
        list: Forecast[];
    }

    export interface Forecast {
        dt: UNIXTimestamp;
        weather: WeatherSummary[];
        main: {
            temp: number;
        };
    }

    export interface WeatherSummary {
        description: string;
        main: string;
        icon: string;
    }
}

export async function getLocation(): Promise<IpLocationInfo> {
    const locationResponse = await fetch('http://ip-api.com/json');
    const locationJSON: IpLocationInfo = await locationResponse.json();
    return locationJSON;
}

export async function getTodaysWeather(lat: number, lon: number): Promise<OpenWeatherMap.Forecast[]> {
    const weatherResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}`
        );
    const weatherResponseJSON: OpenWeatherMap.ForecastResponse = await weatherResponse.json();
    return weatherResponseJSON.list;
}
