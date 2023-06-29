;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory)
	} else {
		root.captureVideoFrame = factory()
	}
})(this, function() {
	return function captureVideoFrame(video, videoWidth, videoHeight, format, quality) {
		if (typeof video === 'string') {
			video = document.getElementById(video)
			// video.setAttribute('crossOrigin', 'Anonymous')
		}

		format = format || 'jpeg'
		quality = quality || 0.92

		if (!video || (format !== 'png' && format !== 'jpeg')) {
			return false
		}

		var canvas = document.createElement('CANVAS')

		//   canvas.width = video.videoWidth;
		//   canvas.height = video.videoHeight;
		canvas.width = videoWidth
		canvas.height = videoHeight

		canvas.getContext('2d').drawImage(video, 0, 0)
		var dataUri = canvas.toDataURL('image/' + format, quality)

		var data = dataUri.split(',')[1]
		var mimeType = dataUri.split(';')[0].slice(5)

		var bytes = window.atob(data)
		var buf = new ArrayBuffer(bytes.length)
		var arr = new Uint8Array(buf)

		for (var i = 0; i < bytes.length; i++) {
			arr[i] = bytes.charCodeAt(i)
		}

		var blob = new Blob([arr], { type: mimeType })

		// video.setAttribute('crossOrigin', 'use-credentials')
		return { blob: blob, dataUri: dataUri, format: format }
	}
})
