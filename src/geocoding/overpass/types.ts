export interface OverpassElement {
	type: 'node' | 'way' | 'relation'
	id: number
	lat?: number // obligatoire pour node
	lon?: number // obligatoire pour node
	center?: {
		// pour way/relation si out center
		lat: number
		lon: number
	}
	tags?: {
		// Identité et classification
		name?: string // nom de la ville / lieu
		place?:
			| 'city'
			| 'town'
			| 'village'
			| 'hamlet'
			| 'suburb'
			| 'locality'
			| string
		population?: string // population si connue
		capital?: 'yes' | '1' // capitale d'état ou pays
		admin_level?: '2' | '4' | '6' | '8' | string // niveau administratif
		// Adresse / localisation
		country?: string // code ISO pays
		state?: string // état / région
		county?: string // comté / département
		// Infos géographiques
		elevation?: string // altitude
		// Transport
		railway?: 'station' | 'halt' | string
		airport?: 'yes' | string
		// Tags divers OSM
		[key: string]: any
	}
}

export interface OverpassResponse {
	version: number
	generator: string
	osm3s: {
		timestamp_osm_base: string
		copyright: string
	}
	elements: OverpassElement[]
}
