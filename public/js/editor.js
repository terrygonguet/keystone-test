/* globals $ interact */
;(function() {
	// import Interract to make the editor draggable
	let script = document.createElement("script")
	script.src =
		"https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.9/interact.min.js"
	document.head.appendChild(script)

	script.onload = function() {
		// create table and its css
		let container = $(`<table id="colorEditor"></table>`)
			.css({
				position: "absolute",
				top: "250px",
				left: "250px",
				background: "var(--background-dark)",
				color: "var(--text-color-dark)",
				padding: "1em",
			})
			.appendTo("body")
		let exit = $(`<i class="fa fa-times"></i>`)
			.css({
				position: "absolute",
				top: "0.4em",
				left: "0.4em",
				cursor: "pointer",
			})
			.click(e => container.detach())
			.appendTo(container)

		let testColor = /^#[0-9A-F]{6}$/i // https://stackoverflow.com/questions/8027423/
		let compStyles = getComputedStyle(document.body)
		let vars = Array.from(compStyles)
			.filter(s => s.startsWith("--"))
			.sort()

		// for each css var we add a line and an input
		for (let cssvar of vars) {
			let cssval = compStyles.getPropertyValue(cssvar).trim()
			let isColor = testColor.test(cssval)
			let row = $(`<tr></tr>`)
			row.append(`<td>${cssvar.slice(2)}</td>`)
			row.append(
				isColor
					? `<td><input type="color" data-var="${cssvar}" value="${cssval}"></td>`
					: "<td></td>"
			)
			row.append(
				`<td><input type="text" data-var="${cssvar}" placeholder="#000000" class="text" value="${cssval}"></td>`
			)
			row.appendTo(container)
		}

		// onchange of the input, update corresponding css var
		$("input", container).each(function() {
			$(this).change(e => {
				let cssvar = $(this).data("var")
				document.documentElement.style.setProperty(`${cssvar}`, this.value)
				if (!$(this).hasClass("text"))
					$(`input.text[data-var=${cssvar}]`, container).val(this.value)
			})
		})

		// make editor draggable
		interact("#colorEditor").draggable({
			onmove(e) {
				let pos = container.position()
				container.css({
					top: (pos.top += e.dy),
					left: (pos.left += e.dx),
				})
			},
		})
	}
})()
