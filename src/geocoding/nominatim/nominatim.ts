import {NominatimResult} from './types.js'

export * from './types.js'

/**
 * Get positions from a global search
 */
export async function geocode(
	query: string,
	lang?: string | undefined | null,
): Promise<NominatimResult[]> {
	const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`

	const options: RequestInit = {}

	if (lang) {
		options.headers = {
			'Accept-Language': lang,
		}
	}

	const response = await fetch(url, options)

	const data: NominatimResult[] = await response.json()
	return data
}
/**
 * Alias of `geocode()`
 */
export const search = geocode

/**
 * Get an address from a position
 *
 * By default the zoom is 18 (max),
 * You can tweak this to cut to a certain threshold.
 * Imaging the initial search is like "capture" stage in DOM event (it starts from the top (space) and goes down (to the earth))
 * The bigger the zoom the closer to earth it goes, and bubbles up with the latest result.
 *
 * A NominatimResult contain an OSM_ID which can then be used in other services like Overpass to get more information (tags)
 * (see. geocoding/overpass module for that)
 */
export async function reverseGeocode(options: {
	lng: number
	lat: number
	/**
	 * @default 18
	 */
	zoom?: number
	/**
	 * @default true
	 */
	addressDetails?: boolean
}): Promise<NominatimResult | null> {
	const zoom = Math.max(0, Math.min(options.zoom ?? 18, 18))
	const addressDetails = options.addressDetails ?? true

	const url =
		`https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
		`&lat=${options.lat}&lon=${options.lng}` +
		`&zoom=${zoom}${addressDetails ? '&addressdetails=1' : ''}`

	const res = await fetch(url)
	const data = await res.json()

	// const a = data.address
	// return a.city || a.town || a.village || a.municipality || a.county || null

	return data as NominatimResult
}

/**
 * Alias of `reverseGeocode`
 */
export const getAddress = reverseGeocode

export function getSmallestPlace(result: NominatimResult): string | null {
	const address = result.address
	return (
		address?.county ||
		address?.country ||
		address?.state ||
		address?.city ||
		address?.town ||
		address?.village ||
		address?.municipality ||
		null
	)
}
