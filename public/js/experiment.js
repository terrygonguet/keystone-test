/* globals $ */
$(document).ready(function () {
	// on description click show popup
	// can't use fadeIn/Out because of display: flex
	$('#btnDescription').click(e => {
		$('#popup')
			.css('visibility', 'initial')
			.animate({ opacity: 1 });
	});

	// any click on the popup hides it
	$('#popup').click(function (e) {
		$(this).animate({ opacity: 0 }, function (e) {
			$(this).css('visibility', 'hidden');
		});
	});

	let experiment = $('#title').text();
	$('#btnYes').click(e => sendOpinion(true, experiment));
	$('#btnNo').click(e => sendOpinion(false, experiment));

	function sendOpinion (interesting, experiment) {
		$.post('/api/experiment/count', {
			interesting, experiment,
		}, function (res) {
			$('#bar').css({ width: (res.true / (res.true + res.false)) * 100 + '%' });
		});
	}

	setInterval(function () {
		$.get('/api/experiment/count', function (res) {
			$('#bar').css({ width: (res.true / (res.true + res.false)) * 100 + '%' });
		});
	}, 1000 * 60 * 10); // every 10 minutes
});
