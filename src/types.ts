import {SourceSpecification as MapLibreGLSourceSpecification} from 'maplibre-gl'

export type SourceSpecification = MapLibreGLSourceSpecification & {name: string}
