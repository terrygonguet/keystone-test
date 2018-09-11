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
	// 'text-node': 'TextNode',
});

cons.nunjucks.render = function (str, options, fn) {
	let env = nunjucks.configure('templates/views');
	env.addFilter('test', async function (p, cb) {
		cb(null, await p);
	}, true);
	env.addFilter('stringifyNews', async function (news, locale, cb) {
		let data = news.map(n => n.toObject());
		await Promise.all(news.map(async (n, i) => {
			data[i].content = await n.localize(locale, 'content');
			data[i].synopsis = await n.localize(locale, 'synopsis');
		}));
		cb(null, JSON.stringify(data));
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
