import * as React from 'react';
import debounce from 'debounce';

import 'babel/polyfill';
import {getLocation, getTodaysWeather} from './weather';
import {lookupPlaceByName} from './geonames';

type DegreesCentigrade = number;
type DegreesKelvin = number;

interface ForecastAt {
	date: Date,
	summary: string;
	iconURL: string;
	temp: DegreesKelvin;
}

interface ForecastViewProps {
	forecasts: ForecastAt[]
}

function kelvinToCelsius(kelvin: DegreesKelvin): DegreesCentigrade {
	return kelvin - 273.15;
}

function timeString(date: Date) {
	return (date as any).toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit'
	});
}

class ForecastView extends React.Component<ForecastViewProps,{}> {
	render() {
		let forecasts = this.props.forecasts.map(forecast =>
		<tr className="forecast-view-row" key={forecast.date.getTime()}>
			<td className="forecast-view-time">{timeString(forecast.date)}</td>
			<td className="forecast-view-temp">{Math.round(kelvinToCelsius(forecast.temp)) + '°C'}</td>
			<td className="forecast-view-summary">{forecast.summary}</td>
			<td className="forecast-view-icon"><img src={forecast.iconURL}/></td>
		</tr>);
		return <table className="forecast-view">
			<tbody>{forecasts}</tbody>
		</table>;
	}
}

interface AppProps {
	summary: string;
	forecasts: ForecastAt[];

	onChangeLocation: (location: string) => void;
}

class AppView extends React.Component<AppProps,{}> {
	render() {
		return <div className="appView">
		  <div>Location: <input ref='location' type='text' onChange={() => this._updateLocation()}/></div>
			<div className="summary">{this.props.summary}</div>
			<ForecastView forecasts={this.props.forecasts}/>
		</div>
	}

	private _updateLocation() {
		const locationInput = React.findDOMNode(this.refs['location']) as HTMLInputElement;
		this.props.onChangeLocation(locationInput.value);
	}
}

interface PlaceInfo {
	name: string;
	lat: number;
	lon: number;
}

async function lookupPlace(location?: string): Promise<PlaceInfo> {
	if (!location) {
		const currentLocation = await getLocation();
		return {
			name: currentLocation.city,
			lat: currentLocation.lat,
			lon: currentLocation.lon
		}
	} else {
		const places = await lookupPlaceByName(location);
		if (places.length > 0) {
			return {
				name: `${places[0].placeName}, ${places[0].adminName1}`,
				lat: places[0].lat,
				lon: places[0].lng
			};
		} else {
			throw new Error('No matching place found');
		}
	}
}

async function displayWeather(placeName?: string) {
	let onChangeLocation = debounce((placeName: string) => {
		displayWeather(placeName);
	}, 500);
	const currentDate = new Date();

	try {
		const location = await lookupPlace(placeName);
		const summary = `Today's outlook for ${location.name} on ${currentDate.toDateString()}:`;
		let weather = await getTodaysWeather(location.lat, location.lon);
		const forecasts = weather.map(forecast => ({
			date: new Date(forecast.dt * 1000),
			summary: forecast.weather[0].description,
			iconURL: `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`,
			temp: forecast.main.temp
		}))
		  .filter(forecast => forecast.date.getDay() === currentDate.getDay());
		React.render(<AppView onChangeLocation={onChangeLocation} summary={summary} forecasts={forecasts}/>,
		  document.getElementById('app'));
	} catch (e) {
		const errorString = `Unable to fetch weather summary: ${e.toString()}`;
		React.render(<AppView onChangeLocation={onChangeLocation} summary={errorString} forecasts={[]}/>,
		  document.getElementById('app'));
	}
}

displayWeather();
