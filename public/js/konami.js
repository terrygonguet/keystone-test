/* globals $ Matter */
// I know it's bad cote but it was hacked together in one night
;(function() {
	let matterjs = document.createElement("script")
	matterjs.src =
		"https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.12.0/matter.min.js"
	matterjs.onload = setup
	document.head.appendChild(matterjs)

	function setup() {
		$("#brandWrapper").detach()
		$("body").css("overflow", "hidden")
		$("#navigationList").css({
			border: "1px solid red",
		})
		let ball = $("<div>")
			.css({
				position: "absolute",
				"border-radius": "100%",
				background: "red",
				top: innerHeight / 2,
				left: innerWidth / 2,
				transform: "translate(-50%, -50%)",
				width: 30,
				height: 30,
			})
			.appendTo("body")
		window.scrollTo(0, 0)
		let colors = ["black", "red", "orange", "yellow", "green", "blue"]

		let game = {
			loop: gameLoop,
			old: 0,
			lastDelta: 16.6,
			engine: Matter.Engine.create(),
			world: null,
			paddleEl: $("#navigationList"),
			paddle: Matter.Bodies.rectangle(
				innerWidth / 2,
				50,
				$("#navigationList").width(),
				$("#navigationList").height(),
				{
					isStatic: true,
					label: "Paddle",
				}
			),
			pWidth: $("#navigationList").width(),
			pHeight: $("#navigationList").height(),
			ball: Matter.Bodies.circle(innerWidth / 2, innerHeight / 3, 15, {
				label: "Ball",
			}),
			ballEl: ball,
			ballSpeed: 9,
		}

		game.world = game.engine.world
		game.world.gravity.scale = 0
		game.ball.friction = 0
		game.ball.frictionAir = 0
		game.ball.restitution = 1

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
		rect = Matter.Bodies.rectangle(innerWidth / 2, -5, innerWidth, 10, {
			isStatic: true,
			label: "Wall Top",
		}) // top wall
		Matter.World.addBody(game.world, rect)
		rect = Matter.Bodies.rectangle(
			innerWidth / 2,
			innerHeight + 5,
			innerWidth,
			10,
			{ isStatic: true, label: "Wall Bottom" }
		) // bottom wall
		Matter.World.addBody(game.world, rect)
		Matter.World.addBody(game.world, game.paddle)
		Matter.World.addBody(game.world, game.ball)

		let brickW = 0.15
		let brickH = 0.09
		for (let i = 0; i < 20; i++) {
			let x = i % 5
			let y = Math.floor(i / 5)
			let brick = Matter.Bodies.rectangle(
				(0.1 + x * 0.01 + (x + 0.5) * brickW) * innerWidth,
				(0.9 - y * 0.01 - (y + 0.5) * brickH) * innerHeight,
				brickW * innerWidth,
				brickH * innerHeight,
				{ isStatic: true, label: "Brick" }
			)
			brick.lives = 6
			brick.el = $("<div>")
				.css({
					position: "absolute",
					background: colors[0],
					top: brick.position.y,
					left: brick.position.x,
					transform: "translate(-50%, -50%)",
					width: brickW * innerWidth,
					height: brickH * innerHeight,
				})
				.appendTo("body")
			Matter.World.addBody(game.world, brick)
		}

		Matter.Events.on(game.engine, "collisionStart", function(e) {
			e.pairs.forEach(p => {
				let brick =
					p.bodyA.label === "Brick"
						? p.bodyA
						: p.bodyB.label === "Brick"
							? p.bodyB
							: null
				let paddle =
					p.bodyA.label === "Paddle"
						? p.bodyA
						: p.bodyB.label === "Paddle"
							? p.bodyB
							: null
				let ball =
					p.bodyA.label === "Ball"
						? p.bodyA
						: p.bodyB.label === "Ball"
							? p.bodyB
							: null
				let wallTop =
					p.bodyA.label === "Wall Top"
						? p.bodyA
						: p.bodyB.label === "Wall Top"
							? p.bodyB
							: null
				if (brick) {
					brick.lives--
					if (brick.lives > 0) {
						brick.el.css("background", colors[6 - brick.lives])
					} else {
						Matter.World.remove(game.world, brick)
						brick.el.detach()
					}
					return
				}
				if (wallTop) {
					Matter.Body.setPosition(ball, {
						x: innerWidth / 2,
						y: innerHeight / 3,
					})
					Matter.Body.setVelocity(ball, { x: 0, y: 1 })
					return
				}
				if (paddle && ball) {
					let dir = normalize({
						x: ball.position.x - paddle.position.x,
						y: ball.position.y - paddle.position.y,
					})
					Matter.Body.setVelocity(ball, scale(dir, game.ballSpeed))
				}
			})
		})

		Matter.Body.setVelocity(game.ball, { x: 0, y: 1 })

		requestAnimationFrame(game.loop.bind(game))
	}

	function gameLoop(time) {
		let delta = time - this.old
		this.old = time
		if (delta < 50) {
			// get and update paddle position
			let position = this.paddleEl.position()
			Matter.Body.setPosition(this.paddle, {
				x: position.left + this.pWidth / 2,
				y: position.top + this.pHeight / 2,
			})
			// update world
			Matter.Engine.update(this.engine, delta, delta / this.lastDelta)
			this.lastDelta = delta
			// update display
			this.ballEl.css({
				top: this.ball.position.y,
				left: this.ball.position.x,
			})
			let ballDir = normalize(this.ball.velocity)
			Matter.Body.setVelocity(this.ball, scale(ballDir, this.ballSpeed))
		}
		requestAnimationFrame(this.loop.bind(this))
	}

	function normalize(vect) {
		let mag = magnitude(vect)
		return { x: vect.x / mag, y: vect.y / mag }
	}

	function magnitude(vect) {
		return Math.sqrt(vect.x * vect.x + vect.y * vect.y)
	}

	function scale(vect, mag) {
		return { x: vect.x * mag, y: vect.y * mag }
	}
})()
