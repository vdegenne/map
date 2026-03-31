import {SourceSpecification} from '../types.js'

function googleTilesUrls(tileSize: 256 | 512) {
	const subdomains = ['mt0', 'mt1', 'mt2', 'mt3']
	const scaleParam = tileSize === 512 ? '&scale=2' : ''
	return subdomains.map(
		(s) => `https://${s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}${scaleParam}`,
	)
}

export const GOOGLE_256: SourceSpecification = {
	name: 'google256',
	type: 'raster',
	tileSize: 256,
	tiles: googleTilesUrls(256),
}

export const GOOGLE_512: SourceSpecification = {
	name: 'google512',
	type: 'raster',
	tileSize: 512,
	tiles: googleTilesUrls(512),
}
