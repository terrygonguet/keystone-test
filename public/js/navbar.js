/* globals $ */
$(document).ready(function() {
	function expand() {
		let maxWidth = $(".shrink")
			.css("width", "initial")
			.toArray()
			.map(e => $(e).width())
			.reduce((acc, cur) => (cur > acc ? cur : acc), 0)
		$(".shrink")
			.css("width", 0)
			.stop()
			.animate({ width: maxWidth })
	}

	function shrink() {
		$(".shrink")
			.stop()
			.animate({ width: 0 })
	}

	$("#nav").hover(expand, shrink)
})
