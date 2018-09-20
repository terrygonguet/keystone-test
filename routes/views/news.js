var keystone = require('keystone');

module.exports = async function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'news';

	locals.news = await keystone.list('News').model.find({ state: 'published', locale: req.params.lang }).sort('-publishedAt').populate('author').exec();
	let id = req.params.id;
	locals.defaultNews = locals.news.find(n => n._id == id) || locals.news[0];

	view.render('news');
};
