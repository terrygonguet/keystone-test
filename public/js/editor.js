/* globals $ interact */
(function () {
	let script = document.createElement('script');
	script.src = 'https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.9/interact.min.js';
	document.head.appendChild(script);
	script.onload = function () {
		let container = $(`<table id="colorEditor"></table>`)
			.css({
				position: 'absolute',
				top: '250px',
				left: '250px',
				background: 'var(--background-dark)',
				color: 'var(--text-color-dark)',
				width: '25vw',
				height: '25vw',
			})
			.appendTo('body');

		let vars = [
			'text-color',
			'text-color-dark',
			'text-color-dark2',
			'background',
			'background-dark',
			'accent-color',
		];

		for (let cssvar of vars) {
			let row = $(`<tr></tr>`);
			row.append(`<td>${cssvar}</td>`);
			row.append(`<td><input type="color" data-var="${cssvar}"></td>`);
			row.append(`<td><input type="text" data-var="${cssvar}" placeholder="#000000" class="text"></td>`);
			row.appendTo(container);
		}

		$('input', container).each(function () {
			$(this).change(e => {
				let cssvar = $(this).data('var');
				document.documentElement.style.setProperty(`--${cssvar}`, this.value);
				if (!$(this).hasClass('text')) $(`input.text[data-var=${cssvar}]`, container).val(this.value);
			});
		});

		interact('#colorEditor')
			.draggable({
				onmove (e) {
					$('#colorEditor').css({ top: e.pageY, left: e.pageX });
				},
			});
	};
})();
