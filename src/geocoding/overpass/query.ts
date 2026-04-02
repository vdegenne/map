import {OverpassElement, OverpassTheme, ThemeFilterFor} from './types.js'

interface MakeQueryLineOptions<T extends OverpassTheme = OverpassTheme> {
	type?: OverpassElement['type']
	theme: T
	themeFilter?: ThemeFilterFor<T>
	center?: {lat: number; lng: number}
	radiusMeters?: number
	bbox?: {minLat: number; minLng: number; maxLat: number; maxLng: number}
	otherFilters?: string
}

export function makeQueryLine(options: MakeQueryLineOptions): string {
	const {
		type = 'node',
		theme = 'place',
		themeFilter,
		center,
		radiusMeters,
		bbox,
		otherFilters = {},
	} = options

	let filters = themeFilter ? `["${theme}"="${themeFilter}"]` : `["${theme}"]`
	if (otherFilters) {
		filters += otherFilters
	}
	// for (const [k, v] of Object.entries(otherFilters)) {
	// 	filters += `["${k}"="${v}"]`
	// }

	if (center && radiusMeters != null) {
		return `${type}${filters}(around:${radiusMeters},${center.lat},${center.lng});`
	} else if (bbox) {
		return `${type}${filters}(${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});`
	} else {
		throw new Error(
			'Overpass query must include either a radius or a bounding box',
		)
	}
}

// Wrapper for radius queries
export function makeRadiusQueryLine<T extends OverpassTheme = OverpassTheme>(
	type: OverpassElement['type'],
	theme: T,
	themeFilter: ThemeFilterFor<T> | undefined,
	center: {lat: number; lng: number},
	radiusMeters: number,
	otherFilters?: string,
) {
	return makeQueryLine({
		type,
		theme,
		themeFilter,
		center,
		radiusMeters,
		otherFilters,
	})
}

// Wrapper for bbox queries
export function makeBboxQueryLine<T extends OverpassTheme = OverpassTheme>(
	type: OverpassElement['type'],
	theme: T,
	themeFilter: ThemeFilterFor<T> | undefined,
	bbox: {minLat: number; minLng: number; maxLat: number; maxLng: number},
	otherFilters?: string,
) {
	return makeQueryLine({type, theme, themeFilter, bbox, otherFilters})
}
