/* globals $ createjs $V */
let userImgs = ['user', 'monitor', 'tablet', 'mobile-phone'];
let users = [];
let letters = [];
let speed = 400; // px/s
let timeSinceLastLetter = 0;
let stage = new createjs.Stage('contactAnim');
let dim = {
	w: $('#contactAnim').width(),
	h: $('#contactAnim').height(),
};
stage.canvas.width = dim.w;
stage.canvas.height = dim.h;

let logo = new createjs.Shape();
let logoPos = $V([dim.w * 0.5, dim.h * 0.2]);
logo.graphics.f('black').r(-16, -16, 32, 32);
logo.x = logoPos.e(1);
logo.y = logoPos.e(2);
stage.addChild(logo);

for (let i = 0; i < 10 + Math.floor(Math.random() * 5); i++) {
	// choose an image and a position at random
	let userImg = userImgs[Math.floor(Math.random() * userImgs.length)];
	let user = new createjs.Bitmap(`images/contact/${userImg}.png`);
	user.x = 0.05 * dim.w + Math.random() * 0.9 * dim.w;
	user.y = 0.6 * dim.h + Math.random() * 0.35 * dim.h;
	users.push(user);
	stage.addChild(user);
}

// update the stage at 60FPS
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener('tick', function (e) {
	timeSinceLastLetter += e.delta / 1000;
	if (Math.random() < timeSinceLastLetter) {
		timeSinceLastLetter = 0;
		let letter = new createjs.Bitmap('images/contact/email.png');
		let user = users[Math.floor(Math.random() * users.length)];
		letter.set({
			x: user.x, y: user.y, regX: 16,
		});
		letters.push(letter);
		stage.addChild(letter);
	}
	for (let letter of letters) {
		let letterPos = $V([letter.x, letter.y]);
		if (letterPos.distanceFrom(logoPos) < e.delta * speed / 1000) {
			stage.removeChild(letter);
			letters = letters.filter(l => l !== letter);
		} else {
			let direction = logoPos.subtract(letterPos).toUnitVector().x(e.delta * speed / 1000);
			letterPos = letterPos.add(direction);
			letter.x = letterPos.e(1);
			letter.y = letterPos.e(2);
		}
	}
	stage.update(e);
});
