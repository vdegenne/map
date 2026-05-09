import {makeBboxQueryLine, makeRadiusQueryLine} from './query.js'
import {
	OverpassElement,
	OverpassElementType,
	OverpassResponse,
	PlaceFilterValue,
} from './types.js'

export * from './types.js'

export async function getTouristSpots(
	lng: number,
	lat: number,
	radius = 500,
): Promise<OverpassElement[]> {
	// TODO: replace query line with function calls
	const query = `
[out:json];
(
  node["tourism"]["tourism"!="hotel"](around:${radius},${lat},${lng});
  way["tourism"]["tourism"!="hotel"](around:${radius},${lat},${lng});
  relation["tourism"]["tourism"!="hotel"](around:${radius},${lat},${lng});
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
	return data.elements as OverpassElement[]
}
export async function getTouristSpotsFromBbox(
	minLat: number,
	minLng: number,
	maxLat: number,
	maxLng: number,
): Promise<OverpassElement[]> {
	const bbox = {minLat, minLng, maxLat, maxLng}

	const query = `
[out:json];
(
  ${makeBboxQueryLine('node', 'tourism', undefined, bbox, '["tourism"!="hotel"]')}
  ${makeBboxQueryLine('way', 'tourism', undefined, bbox, '["tourism"!="hotel"]')}
  ${makeBboxQueryLine('relation', 'tourism', undefined, bbox, '["tourism"!="hotel"]')}
  ${makeBboxQueryLine('node', 'historic', undefined, bbox)}
  ${makeBboxQueryLine('way', 'historic', undefined, bbox)}
  ${makeBboxQueryLine('relation', 'historic', undefined, bbox)}
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
	return data.elements as OverpassElement[]
}

export async function getPlacesAroundRadius(
	center: {lat: number; lng: number},
	radiusMeters: number,
	placeTypes: PlaceFilterValue[] = ['city'],
	otherFilters?: string,
): Promise<OverpassElement[]> {
	if (placeTypes.length === 0) {
		console.warn(
			'You are calling `getPlacesAroundRadius` without specifying place types.',
		)
		return []
	}

	const queryLines = placeTypes.map((placeFilter) =>
		makeRadiusQueryLine(
			'node',
			'place',
			placeFilter,
			center,
			radiusMeters,
			otherFilters,
		),
	)

	const query = `
[out:json][timeout:25];
(
${queryLines.join('')}
);
out body;
`

	const url = 'https://overpass-api.de/api/interpreter'

	// console.log(`Query: ${query}`)
	const response = await fetch(url, {
		method: 'POST',
		body: query,
		headers: {'Content-Type': 'text/plain'},
	})

	if (!response.ok) {
		throw new Error(`Overpass request failed: ${response.statusText}`)
	}

	const data: OverpassResponse = await response.json()

	return data.elements as OverpassElement[]
}

/**
 * Provide an OSM_ID and it returns Overpass tags (information about the place)
 *
 * Depending on the OSM_ID (if it's a street, city, state, ...) you get different information
 * For instance you can get the population if the OSM_ID point to a city or country, ... not a street
 *
 * You can get an OSM_ID from a NominatimResult from geocodeReverse for example (from the geocoding/nominatim module)
 * and tweaking the `zoom` parameter will get you different ids.
 */
export async function getPlaceInfoFromOsmId(
	osmType: OverpassElementType,
	osmId: number,
) {
	const query = `
[out:json];
${osmType}(${osmId});
out tags;
`
	const url = 'https://overpass-api.de/api/interpreter'

	const response = await fetch(url, {
		method: 'POST',
		body: query,
		headers: {'Content-Type': 'text/plain'},
	})

	if (!response.ok) {
		throw new Error(`Overpass request failed: ${response.statusText}`)
	}

	const data: OverpassResponse = await response.json()
	return data.elements[0] ?? undefined
}

export async function getCity(lng: number, lat: number) {
	const query = `
[out:json][timeout:25];
rel(around:50,${lat},${lng})
["boundary"="administrative"];
out tags ids;
`

	const res = await fetch('https://overpass-api.de/api/interpreter', {
		method: 'POST',
		body: query,
		headers: {'Content-Type': 'text/plain'},
	})

	const data = await res.json()

	const elements = data.elements ?? []

	return (
		elements
			.filter((e: any) => e.tags?.admin_level)
			.sort(
				(a: any, b: any) =>
					Number(b.tags.admin_level) - Number(a.tags.admin_level),
			)[0] ?? null
	)
}
