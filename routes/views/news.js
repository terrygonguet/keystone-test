var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'news';

	keystone.list('News').model.find({ state: 'published' }).sort('-publishedAt').exec(function (err, news) {
		if (err) throw err;
		locals.news = news;
		// Render the view
		view.render('news');
	});

};
