export interface NominatimResult {
	place_id: number
	licence: string
	osm_type: 'node' | 'way' | 'relation'
	osm_id: number
	boundingbox: [string, string, string, string]
	lat: string
	lon: string
	display_name: string
	class?: string // ex: "building", "amenity", etc.
	type?: string // ex: "restaurant", "school", etc.
	importance?: number
	icon?: string // parfois présent pour search
	address: {
		house_number?: string
		road?: string
		neighbourhood?: string
		suburb?: string
		village?: string
		town?: string
		city?: string
		county?: string
		state?: string
		postcode?: string
		country?: string
		country_code?: string
		attraction?: string
		[key: string]: string | undefined // pour tout autre champ inattendu
	}
	namedetails?: {
		[key: string]: string // si &extratags=1 ou &namedetails=1
	}
}

interface OverpassElement {
	type: 'node' | 'way' | 'relation'
	id: number
	lat: number // pour les nodes
	lon: number // pour les nodes
	center?: {
		// pour les ways/relations avec out center
		lat: number
		lon: number
	}
	tags?: Record<string, string> // ex: { name: "Louvre", tourism: "museum" }
}

export async function geocode(
	query: string,
	lang = 'fr',
): Promise<NominatimResult[]> {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

	const response = await fetch(url, {
		headers: {
			'Accept-Language': lang, // optionnel
		},
	})

	const data: any[] = await response.json()

	return data
}

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
// export const getAddress = reverseGeocode

interface OverpassResponse {
	version: number
	generator: string
	osm3s: {
		timestamp_osm_base: string
		copyright: string
	}
	elements: OverpassElement[]
}

export async function getTouristSpots(
	lng: number,
	lat: number,
	radius = 500,
): Promise<OverpassElement[]> {
	const query = `
[out:json];
(
  node["tourism"](around:${radius},${lat},${lng});
  way["tourism"](around:${radius},${lat},${lng});
  relation["tourism"](around:${radius},${lat},${lng});
  node["historic"](around:${radius},${lat},${lng});
  way["historic"](around:${radius},${lat},${lng});
  relation["historic"](around:${radius},${lat},${lng});
);
out center;
`

	const response = await fetch('https://overpass-api.de/api/interpreter', {
		method: 'POST',
		body: query,
		headers: {'Content-Type': 'text/plain'},
	})

	if (!response.ok) {
		throw new Error('Erreur Overpass API')
	}
	const data: OverpassResponse = await response.json()
	return data.elements
}
