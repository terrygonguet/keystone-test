;(function() {
	let vars = [
		"text-color",
		"text-color-dark",
		"text-color-dark2",
		"background",
		"background-dark",
		"background-light",
		"accent-color",
	]
	let colors = {}

	for (let cssvar of vars) {
		let color = randColor()
		document.documentElement.style.setProperty(`--${cssvar}`, color)
		colors[cssvar] = color
	}
	console.log(colors)

	function randColor() {
		let randHex = () =>
			Math.floor(Math.random() * 255)
				.toString(16)
				.padStart(2, "0")
				.toUpperCase()
		return `#${randHex()}${randHex()}${randHex()}`
	}
})()
