/* globals $ */
$(document).ready(function () {
	let rail = $('#trainRail');
	let train = $('#navigationList');
	let trainWidth = train.width();
	let bounds = { start: rail.position().left, end: rail.position().left + trainWidth };
	let trainPos = trainWidth / 2;
	let speed = 800;

	function onInterraction (e) {
		// only if we hover/move over the rail itself
		if (e.target !== rail[0]) return;
		let left = e.clientX - trainWidth / 2 - bounds.start;
		// keep the navbar in the screen
		if (left < 0) {
			left = 0;
		} else if (left > rail.width() - trainWidth) {
			left = rail.width() - trainWidth;
		}
		// compute duration to simulate constant speed
		let duration = Math.abs(left - trainPos) / speed * 1000;
		train.stop().animate({ left }, {
			duration,
			easing: 'linear',
			step: (now) => (trainPos = now), // keep track of where the bar is if the animation is interrupted
		});
	}

	rail.hover(onInterraction).mousemove(onInterraction);
});
