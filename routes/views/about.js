var keystone = require("keystone")

exports = module.exports = async function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "about"

	locals.descriptions = await keystone
		.list("UserDescription")
		.model.find({ locale: req.params.lang, showInAbout: true })
		.populate("user")

	view.render("about")
}
