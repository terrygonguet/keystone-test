var keystone = require("keystone")

module.exports = async function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "news"

	locals.news = await keystone
		.list("News")
		.model.find({
			state: "published",
			locale: req.params.lang,
			tags: req.params.tag,
		})
		.populate("author")
		.sort("-publishedAt")
		.exec()

	locals.currentTag = req.params.tag
	locals.defaultNews = locals.news[0]

	view.render("news")
}
