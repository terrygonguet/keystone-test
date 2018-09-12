var keystone = require('keystone');

module.exports = async function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'news';

	locals.news = await keystone.list('News').model.find({ state: 'published', locale: req.params.lang }).sort('-publishedAt').exec();
	locals.defaultNews = req.params.id;

	view.render('news');
};
