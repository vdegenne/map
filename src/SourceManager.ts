import {LayerSpecification} from 'maplibre-gl'
import {SourceSpecification} from './types.js'

export class SourcesManager {
	constructor(private sources: SourceSpecification[]) {}
}
