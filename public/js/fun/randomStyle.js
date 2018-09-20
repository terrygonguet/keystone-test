(function () {
	let vars = [
		'text-color',
		'text-color-dark',
		'text-color-dark2',
		'background',
		'background-dark',
		'background-light',
		'accent-color',
	];
	let colors = {};

	for (let cssvar of vars) {
		let color = `rgb(${rand()}, ${rand()}, ${rand()})`;
		document.documentElement.style.setProperty(`--${cssvar}`, color);
		colors[cssvar] = color;
	}

	function rand () {
		return Math.floor(Math.random() * 255);
	}
})();
