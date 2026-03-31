import {SourceSpecification} from '../types.js'

const subdomains = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']

function eoxSatelliteUrls(): string[] {
	const layer = 's2cloudless-2024_3857'
	const style = 'default'
	const tileMatrixSet = 'GoogleMapsCompatible'
	/**
	 * From s2maps-tiles.eu
	 */
	const s2mapsTiles = subdomains.map(
		(s) =>
			`https://s2maps-tiles.eu/wmts?` +
			`layer=${layer}&style=${style}&tilematrixset=${tileMatrixSet}` +
			`&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg` +
			`&TileMatrix={z}&TileCol={x}&TileRow={y}`,
	)

	/**
	 * From tiles.maps.eox.at (Params version)
	 */
	const tilesMapsParamsVersion = subdomains.map(
		(s) =>
			`https://${s}.tiles.maps.eox.at/wmts?` +
			`layer=${layer}&style=${style}&tilematrixset=${tileMatrixSet}` +
			`&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg` +
			`&TileMatrix={z}&TileCol={x}&TileRow={y}`,
	)

	/**
	 * From tiles.maps.eox.at (URL version)
	 */
	const tilesMapsUrlVersion = subdomains.map(
		(s) =>
			`https://${s}.tiles.maps.eox.at/wmts/1.0.0/${layer}/${style}/g/{z}/{y}/{x}.jpg`,
	)
	return [
		// ...s2mapsTiles, //
		...tilesMapsParamsVersion,
		...tilesMapsUrlVersion,
	]
}

function eoxLabelsUrls() {
	const overlayLayer = 'overlay_base'
	const style = 'default'
	const tileMatrixSet = 'GoogleMapsCompatible'

	const overlayTilesParamsVersion = subdomains.map(
		(s) =>
			`https://${s}.tiles.maps.eox.at/wmts?` +
			`layer=${overlayLayer}&style=${style}&tilematrixset=${tileMatrixSet}` +
			`&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg` +
			`&TileMatrix={z}&TileCol={x}&TileRow={y}`,
	)

	return overlayTilesParamsVersion
}

export const EOX_SATELLITE: SourceSpecification = {
	name: 'eoxSatellite',
	type: 'raster',
	tiles: eoxSatelliteUrls(),
	tileSize: 256,
}

export const EOX_LABELS: SourceSpecification = {
	name: 'eoxLabels',
	type: 'raster',
	tiles: eoxLabelsUrls(),
	tileSize: 256,
}
