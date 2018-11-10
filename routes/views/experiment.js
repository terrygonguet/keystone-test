var keystone = require("keystone")
var IOMeter = keystone.list("Interestometer")

module.exports = async function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	let counts = await IOMeter.model
		.aggregate([
			{
				$group: {
					_id: "$interesting",
					count: { $sum: 1 },
				},
			},
		])
		.exec()
	let data = { true: 0, false: 0 }
	counts.forEach(c => (data[c._id] = c.count))

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "experiment"
	locals.experiment = {
		url: "https://terry.gonguet.com/naga",
		title: "Project Naga",
		description: {
			en: "Snake, but it's a roguelike dungeon crawler. Nuff said.",
			fr: "Snake, mais c'est un dungeon crawler roguelike. C'est tout.",
		},
	}
	locals.counts = data

	// Render the view
	view.render("experiment")
}
