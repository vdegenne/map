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
		city_district?: string
		municipality?: string
		/**
		 * In french this is "departement"
		 */
		county?: string
		/**
		 * In french this is "region"
		 */
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
