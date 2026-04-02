import {makeRadiusQueryLine} from './query.js'
import {OverpassElement, OverpassResponse, PlaceFilterValue} from './types.js'

export * from './types.js'

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

	console.log(`Query: ${query}`)
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
