/* globals $ moment */
var data = JSON.parse($('#newsData').val());

$('.articleWrapper').click(function (e) {
	let _id = $(this).data('id');
	let article = data.find(a => a._id === _id);
	let offset = $(this).offset();
	let reader = $('#TheReaderWrapper');
	let readerOffset = reader.offset();

	$('.articleWrapper').removeClass('selected');
	$(this).addClass('selected');

	let clone = $(this).clone(false);
	clone
		.css({
			position: 'absolute',
			top: offset.top,
			left: offset.left,
			margin: 0,
		})
		.appendTo('body')
		.animate({
			top: readerOffset.top,
			left: readerOffset.left,
			width: reader.width(),
			height: reader.height(),
			backgroundColor: reader.css('background-color'),
			color: reader.css('color'),
			paddingRight: 0,
			paddingBottom: 0,
		}, {
			duration: 700,
			done: () => {
				$('#readerName').text(article.name);
				$('#readerPublished').text(moment(article.publishedAt).format('Do MMM YYYY'));
				$('#readerContent').html(article.content);
				clone.fadeOut(() => clone.detach());

				let path = location.pathname;
				if (path.endsWith('/news')) {
					path += '/' + _id;
				} else if (path.endsWith('/news/')) {
					path += _id;
				} else {
					path = path.replace(/news\/(.+?)$/, 'news/' + _id);
				}
				history.pushState(null, '', path);
			},
		});
});

// load default article or first
$(document).ready(function () {
	let _id = $('#TheReaderWrapper').data('default-news');
	let article = _id ? data.find(a => a._id === _id) : data[0];
	$('#readerName').text(article.name);
	$('#readerPublished').text(moment(article.publishedAt).format('Do MMM YYYY'));
	$('#readerContent').html(article.content);
	$('#TheReaderWrapper').css('color', 'var(--text-color)');
});
