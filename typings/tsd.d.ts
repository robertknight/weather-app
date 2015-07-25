/// <reference path="whatwg-fetch/whatwg-fetch.d.ts" />
/// <reference path="react/react.d.ts" />

declare module 'isomorphic-fetch' {
	export default function fetch(url: string, init?: RequestInit): Promise<Response>;
}

declare module 'babel/polyfill' {
}

declare module 'debounce' {
	export default function debounce<T>(callback: T, time: number): T;
}
