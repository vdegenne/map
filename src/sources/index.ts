import type {SourceSpecification} from 'maplibre-gl'
import {EOX_LABELS, EOX_SATELLITE} from './eox.js'
import {GOOGLE_256, GOOGLE_512} from './google.js'

type VMapSources = {
	raster: {
		streets: Record<
			'GOOGLE_256' | 'GOOGLE_512' | 'EOX_LABELS',
			SourceSpecification
		>
		satellite: Record<'EOX_SATELLITE', SourceSpecification>
	}
	vector: Record<string, SourceSpecification>
}

export namespace vmap {
	export const source = {
		raster: {
			streets: {
				GOOGLE_256,
				GOOGLE_512,
				EOX_LABELS,
			},
			satellite: {
				EOX_SATELLITE,
			},
		},
		vector: {},
	} satisfies VMapSources
}
