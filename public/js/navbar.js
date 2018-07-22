/* globals $ */
$(document).ready(function () {
	let rail = $('#trainRail');
	let train = $('#navigationList');
	let trainWidth = train.width();
	let trainPos = trainWidth / 2;
	let speed = 800;

	rail.hover(function (e) {
		let left = e.clientX - trainWidth / 2;
		if (left < 0) {
			left = 0;
		} else if (left > innerWidth - trainWidth) {
			left = innerWidth - trainWidth;
		}
		let duration = Math.abs(left - trainPos) / speed * 1000;
		train.stop().animate({ left }, {
			duration,
			easing: 'linear',
			step: (now) => (trainPos = now),
		});
	});
});
