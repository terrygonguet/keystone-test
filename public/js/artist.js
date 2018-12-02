const msnry = new Masonry("#pictures", {
	itemSelector: ".picture",
	columnWidth: ".sizer",
	percentPosition: true,
	gutter: ".gutter",
	transitionDuration: 0,
})
$("img").on("load", function() {
	msnry.layout()
})
