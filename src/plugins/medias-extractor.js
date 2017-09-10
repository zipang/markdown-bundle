module.exports = {
	// A regular expression that extracts the media name [1] and media url [2]
	allmedias: /^@\[([a-z]+)\]\(([\-\?=:./\w]+)\)/, // matches @[youtube](https://youtu.be/My4j3vgFxbE) or @[vimeo](https://vimeo.com/74547305)
	// default mode for rendering the media : render the iframe
	mode: "embed", // possible values at the moment : embed|launcher
	youtube: {
		ratio: "4by3",
		launcher: (videoId)=>`
		<a class="youtube embed" rel="youtube" href="https://youtu.be/${videoId}" data-embed-url="https://www.youtube.com/embed/${videoId}?autoplay=1&amp;rel=0">
			<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" class="img-fluid" alt="Video">
			<i class="icon fa fa-youtube-play fa-5x"></i>
		</a>`,
		embed: (videoId)=>`
		<iframe class="youtube embed-responsive-item" frameborder="0" allowfullscreen
			src="https://www.youtube.com/embed/${videoId}?rel=0"></iframe>`
	},
	vimeo: {
		ratio: "16by9",
		launcher: (videoId)=>`
		<a class="vimeo embed" rel="vimeo" href="https://vimeo.com/${videoId}" data-embed-url="https://player.vimeo.com/video/${videoId}?autoplay=1">
			<img src="https://placehold.it/640x360" data-video-id="${videoId}" class="img-fluid" alt="Video">
			<i class="icon fa fa-vimeo-square fa-5x"></i>
		</a>`,
		embed: (videoId)=>`
		<iframe class="embed-responsive-item" frameborder="0" allowfullscreen
			src="https://player.vimeo.com/video/${videoId}"></iframe>`
	},
	whyd: {
		ratio: "4by3",
		extractMediaId: (media, playlistUrl)=>playlistUrl,
		embed: (playlistUrl)=>`
		<iframe class="embed-responsive-item" frameborder="0" allowfullscreen
			src="${playlistUrl}?format=embedV2&embedW=480"></iframe>`

	},
	pdf: {
		ratio: "210by297",
		extractMediaId: (media, pdfDocUrl)=>pdfDocUrl,
		notSupportedMessage: "Your browser isn't supporting embedded pdf files. You can download the file here : ",
		embed: (pdfDocUrl, settings)=>`
		<object class="embed-responsive-item" data="${pdfDocUrl}" type="application/pdf" title="">
			<p>${settings.notSupportedMessage}<a href="${pdfDocUrl}">here</a>.</p>
		</object>`

	},
	// wraps the provided iframe with bootstrap responsive classes
	embedResponsive: (content, settings)=>`
	<div class="embed-responsive embed-responsive-${settings.ratio}">${content}</div>`
}
