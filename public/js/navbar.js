/* globals $ */
$(document).ready(function () {
	let rail = $('#trainRail');
	let train = $('#navigationList');
	let trainWidth = train.width();
	let trainPos = 0;
	let speed = 800;
	let target = 0;

	function onInterraction (e) {
		// only if we hover/move over the rail itself
		if (e.target !== rail[0]) return;
		let bounds = { start: rail.position().left, end: rail.position().left + trainWidth };
		target = e.clientX - trainWidth / 2 - bounds.start;
		// keep the navbar in the screen
		if (target < 0) {
			target = 0;
		} else if (target > rail.width() - trainWidth) {
			target = rail.width() - trainWidth;
		}
	}

	rail.mousemove(onInterraction);

	train.mousemove(function () { target = trainPos; });

	let old = 0;
	requestAnimationFrame(function raf (time) {
		let delta = time - old;
		old = time;
		if (Math.abs(target - trainPos) >= delta * speed / 1000) {
			trainPos += delta * speed / 1000 * Math.sign(target - trainPos);
		} else {
			trainPos = target;
		}
		train.css('left', trainPos);
		requestAnimationFrame(raf);
	});
});
