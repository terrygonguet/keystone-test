// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const cons = require('consolidate');
const nunjucks = require('nunjucks');
const i18n = require('i18n');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Proto Keystone',
	'brand': 'Proto Keystone',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.html',
	'custom engine': cons.nunjucks,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// cloudinary options
keystone.set('cloudinary prefix', 'keystone');
keystone.set('cloudinary folders', true);
keystone.set('cloudinary secure', true);

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	enquiries: 'enquiries',
	users: 'users',
	news: 'news',
	TextNode: 'TextNode',
});

// override render function to load custom filter(s)
cons.nunjucks.render = function (str, options, fn) {
	let env = nunjucks.configure('templates/views');
	env.addFilter('processNewsAsync', async function processNewsAsync (news, locale, cb) {
		let data = news.map(n => n.toObject());

		// find all the keys to fetch and get them
		let keys = [];
		for (let article of data) {
			article.content && keys.push(article.content);
		}
		let nodes = await keystone.list('TextNode').model.find({ language: locale, name: { $in: keys } }).exec();

		// replace fetched content and synopsis in the articles
		for (let node of nodes) {
			let article = data.find(a => a.content === node.name);
			if (article) {
				article.content = node.content;
				article.synopsis = node.synopsis;
				article.name = node.title;
			}
		}

		// return data to template engine
		cb(null, data);
	}, true);
	env.renderString(str, options, fn);
};

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}

i18n.configure({
	locales: ['en', 'fr'],
	directory: __dirname + '/locales',
	objectNotation: true,
});

keystone.start();
