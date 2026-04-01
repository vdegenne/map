import {OverpassElement, OverpassResponse} from './types.js'

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

export async function getCitiesAround(
	center: {lat: number; lng: number},
	radiusMeters: number,
): Promise<OverpassElement[]> {
	const query = `
[out:json][timeout:25];
(
  node["place"="city"](around:${radiusMeters},${center.lat},${center.lng});
  node["place"="town"](around:${radiusMeters},${center.lat},${center.lng});
);
out body;
`

	const url = 'https://overpass-api.de/api/interpreter'

	const response = await fetch(url, {
		method: 'POST',
		body: query,
		headers: {'Content-Type': 'text/plain'},
	})

	const data: OverpassResponse = await response.json()

	return data.elements as OverpassElement[]
}
