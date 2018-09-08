/* globals $ createjs $V */
let userImgs = ['user', 'monitor', 'tablet', 'mobile-phone'];
let users = [];
let letters = [];
let speed = 400; // px/s
let timeSinceLastTick = 0;
let timeSinceLastLetter = 0;
let stage = new createjs.Stage('contactAnim');

let dim = {
	w: $('#contactAnim').width(),
	h: $('#contactAnim').height(),
};
stage.canvas.width = dim.w;
stage.canvas.height = dim.h;
let logo = new createjs.Shape();
let logoPos = $V([dim.w * 0.5, dim.h * 0.5]);
logo.graphics.f('black').r(-16, -16, 32, 32);
logo.x = logoPos.e(1);
logo.y = logoPos.e(2);
stage.addChild(logo);

// function resize () {
// 	let newDim = {
// 		w: $('#contactAnim').width(),
// 		h: $('#contactAnim').height(),
// 	};
// 	stage.canvas.width = newDim.w;
// 	stage.canvas.height = newDim.h;
// 	users.forEach(u => u.set({ x: u.x / dim.w * newDim.w, y: u.x / dim.h * newDim.h }));
// 	logoPos = $V([newDim.w * 0.5, newDim.h * 0.5]);
// 	dim = newDim;
// }
// document.addEventListener('resize', resize);

let nbUsers = 15 + Math.floor(Math.random() * 5);
do {
	let userPos = $V([
		0.05 * dim.w + Math.random() * 0.9 * dim.w,
		0.15 * dim.h + Math.random() * 0.8 * dim.h,
	]);
	// if the point is too close to the logo or other users we don't create the user
	let isClose = users.find(u => userPos.distanceFrom($V([u.x, u.y])) <= 60);
	if (!isClose && userPos.distanceFrom(logoPos) >= 150) {
		let userImg = userImgs[Math.floor(Math.random() * userImgs.length)];
		let user = new createjs.Bitmap(`/images/contact/${userImg}.png`);
		user.set({ x: userPos.e(1), y: userPos.e(2), regX: 16, regY: 16 });
		users.push(user);
		stage.addChild(user);
	}
} while (users.length < nbUsers);

// update the stage at 60FPS
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.addEventListener('tick', function (e) {
	timeSinceLastTick += e.delta;
	timeSinceLastLetter += e.delta;
	if (timeSinceLastTick > 1000 / 20 && timeSinceLastLetter > 1000 && Math.random() < 0.1) {
		timeSinceLastTick = timeSinceLastLetter = 0;
		let letter = new createjs.Bitmap('/images/contact/email.png');
		let user = users[Math.floor(Math.random() * users.length)];
		letter.set({
			x: user.x, y: user.y, regX: 16, regY: 16,
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
