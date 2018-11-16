var keystone = require("keystone")

exports = module.exports = async function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "artist"
	locals.key = req.params.key

	locals.gallery = await keystone
		.list("ArtistGallery")
		.model.findOne({ key: req.params.key })
		.populate("user")

	locals.description = await keystone
		.list("UserDescription")
		.model.findOne({ user: locals.gallery.user._id, locale: req.params.lang })

	view.render("artist")
}
