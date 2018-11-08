/* globals $ Matter */
// I know it's bad code but it was hacked together in one night
;(function() {
	let matterjs = document.createElement("script")
	matterjs.src =
		"https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.12.0/matter.min.js"
	matterjs.onload = setup
	document.head.appendChild(matterjs)

	function setup() {
		$("body").css("overflow", "hidden")

		let game = {
			loop: gameLoop,
			old: 0,
			lastDelta: 16.6,
			engine: Matter.Engine.create(),
			world: null,
			boxes: null,
		}

		game.world = game.engine.world

		let rect = Matter.Bodies.rectangle(-5, innerHeight / 2, 10, innerHeight, {
			isStatic: true,
			label: "Wall Left",
		}) // left wall
		Matter.World.addBody(game.world, rect)
		rect = Matter.Bodies.rectangle(
			innerWidth + 5,
			innerHeight / 2,
			10,
			innerHeight,
			{ isStatic: true, label: "Wall Right" }
		) // right wall
		Matter.World.addBody(game.world, rect)
		// rect = Matter.Bodies.rectangle(innerWidth / 2, -5, innerWidth, 10, {
		// 	isStatic: true,
		// 	label: "Wall Top",
		// }) // top wall
		// Matter.World.addBody(game.world, rect)
		rect = Matter.Bodies.rectangle(
			innerWidth / 2,
			innerHeight + 5,
			innerWidth,
			10,
			{ isStatic: true, label: "Wall Bottom" }
		) // bottom wall
		Matter.World.addBody(game.world, rect)

		allTheStuff = $("p,a,h1,h2,h3,h4,h5,i")

		game.boxes = allTheStuff.get().map(el => ({
			width: $(el).width(),
			height: $(el).height(),
			...$(el).offset(),
			el,
		}))
		game.boxes.forEach(b => {
			$(b.el)
				.css({
					position: "absolute",
					// border: "1px solid var(--accent-color)",
					...b,
				})
				.detach()
				.appendTo("body")
			b.rect = Matter.Bodies.rectangle(
				b.left + b.height / 2,
				b.top + b.width / 2,
				b.width,
				b.height,
				{
					// chamfer: { radius: 10 },
					label: $(b.el).text(),
				}
			)
			b.rect.el = b.el
			Matter.World.addBody(game.world, b.rect)
		})
		// game.boxes.forEach(b => {
		// 	if (
		// 		!$(b.el)
		// 			.text()
		// 			.trim()
		// 	) {
		// 		Matter.World.remove(game.world, b.rect)
		// 		$(b.el).detach()
		// 	}
		// })
		Matter.World.add(game.world, Matter.MouseConstraint.create(game.engine))

		console.log(Matter.Composite.allBodies(game.world))

		requestAnimationFrame(game.loop.bind(game))
	}

	function gameLoop(time) {
		let delta = time - this.old
		this.old = time
		if (delta < 50) {
			// update world
			Matter.Engine.update(this.engine, delta, delta / this.lastDelta)
			this.lastDelta = delta
			// update display
			this.boxes.forEach(b => {
				$(b.el).css({
					top: b.rect.position.y - b.height / 2,
					left: b.rect.position.x - b.width / 2,
					transform: `rotate(${b.rect.angle}rad)`,
				})
			})
		}
		requestAnimationFrame(this.loop.bind(this))
	}

	// function normalize(vect) {
	// 	let mag = magnitude(vect)
	// 	return { x: vect.x / mag, y: vect.y / mag }
	// }

	// function magnitude(vect) {
	// 	return Math.sqrt(vect.x * vect.x + vect.y * vect.y)
	// }

	// function scale(vect, mag) {
	// 	return { x: vect.x * mag, y: vect.y * mag }
	// }
})()
