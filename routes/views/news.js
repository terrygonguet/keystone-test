var keystone = require("keystone")
var i18n = require("i18n")

module.exports = async function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "news"

	locals.news = await keystone
		.list("News")
		.model.find({ state: "published", locale: req.params.lang })
		.sort("-publishedAt")
		.populate("author")

	let id = req.params.id
	i18n.setLocale(res, req.params.lang)
	locals.defaultNews = locals.news.find(n => n._id == id)

	if (!locals.defaultNews) {
		locals.defaultNews = !id
			? locals.news[0]
			: {
					name: i18n.__.call(res, "news.notfound.name"),
					content: i18n.__.call(res, "news.notfound.content"),
			  }
	}

	view.render("news")
}
