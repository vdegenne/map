export type OverpassTheme =
	| 'place'
	| 'amenity'
	| 'highway'
	| 'shop'
	| 'tourism'
	| 'historic'
	| 'leisure'
	| 'natural'
	| 'building'
	| 'landuse'
	| 'waterway'
	| 'railway'

export type PlaceFilterValue =
	| 'city'
	| 'town'
	| 'village'
	| 'hamlet'
	| 'suburb'
	| 'locality'
export type HistoricFilterValue =
	| 'castle'
	| 'monument'
	| 'memorial'
	| 'ruins'
	| 'archaeological_site'
export type TourismFilterValue =
	| 'museum'
	| 'artwork'
	| 'hotel'
	| 'viewpoint'
	| 'gallery'
	| 'zoo'

export interface OverpassElement {
	type: 'node' | 'way' | 'relation'

	/** Identifiant unique de l’élément OSM */
	id: number

	/** Latitude du point (obligatoire pour les nodes) */
	lat?: number

	/** Longitude du point (obligatoire pour les nodes) */
	lon?: number

	/** Coordonnées centrales pour les ways ou relations si `out center` est utilisé */
	center?: {
		/** Latitude du centre */
		lat: number
		/** Longitude du centre */
		lon: number
	}

	tags?: {
		// Identité et classification
		/** Nom du lieu ou de la ville */
		name?: string
		[nameWithLang: `name:${string}`]: string

		/**
		 * Type de lieu
		 */
		place?: PlaceFilterValue

		/**
		 * Type historique
		 */
		historic?: HistoricFilterValue

		/**
		 * Type de tourisme
		 */
		tourism?: TourismFilterValue

		/** Population si connue (chaîne de caractères) */
		population?: string
		/** Date de la population */
		'population:date'?: string
		/** Source de la population */
		'source:population'?: string
		/** Capitale d’état ou pays */
		capital?: 'yes' | '1' | '4'
		/** Niveau administratif (ISO OSM) */
		admin_level?: '2' | '4' | '6' | '8' | string

		// Adresse / localisation
		/** Code ISO du pays */
		country?: string
		/** État / région */
		state?: string
		/** Comté / département */
		county?: string

		// Infos géographiques
		/** Altitude */
		elevation?: string

		// Transport
		/** Station ferroviaire */
		railway?: 'station' | 'halt' | string
		/** Présence d’un aéroport */
		airport?: 'yes' | string

		// Tags divers OSM
		/** Identifiant Wikidata */
		wikidata?: string
		/** Page Wikipedia */
		wikipedia?: string
		/** Site officiel */
		website?: string
		/** Référence SIREN France */
		'ref:FR:SIREN'?: string
		/** Nom officiel */
		official_name?: string
		/** Nom officiel en français */
		'official_name:fr'?: string
		/** Nom officiel en langue locale */
		'official_name:vls'?: string

		/** Tout autre tag OSM non listé */
		[key: string]: any
	}
}

export type ThemeFilterFor<T extends OverpassTheme> = T extends 'place'
	? PlaceFilterValue
	: T extends 'historic'
		? HistoricFilterValue
		: T extends 'tourism'
			? TourismFilterValue
			: string // fallback pour les autres thèmes ou valeurs personnalisées

export interface OverpassResponse {
	version: number
	generator: string
	osm3s: {
		timestamp_osm_base: string
		copyright: string
	}
	elements: OverpassElement[]
}
