import {NominatimResult} from './types.js'

export * from './types.js'

/**
 * Get positions from a global search
 */
export async function geocode(
	query: string,
	lang?: string | undefined | null,
): Promise<NominatimResult[]> {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

	const options: RequestInit = {}

	if (lang) {
		options.headers = {
			'Accept-Language': lang,
		}
	}

	const response = await fetch(url, options)

	const data: any[] = await response.json()
	return data
}
/**
 * Alias of `geocode()`
 */
export const search = geocode

/**
 * Get an address from a position
 */
export async function reverseGeocode(position: {
	lng: number
	lat: number
}): Promise<NominatimResult> {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`,
	)
	const data = await response.json()
	return data as NominatimResult
}

/**
 * Alias of `reverseGeocode`
 */
export const getAddress = reverseGeocode
