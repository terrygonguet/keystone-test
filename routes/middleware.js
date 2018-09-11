/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');
const i18n = require('i18n');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'navlinks.home', key: 'home', href: '/' },
		{ label: 'navlinks.contact', key: 'contact', href: '/contact' },
		{ label: 'navlinks.about', key: 'about', href: '/about' },
		{ label: 'navlinks.news', key: 'news', href: '/news' },
	];
	res.locals.user = req.user;
	res.locals.url = req.originalUrl;
	next();
};

exports.i18n = function (req, res, next) {
	i18n.setLocale(req, req.params.lang, false);
	res.locals.__ = res.__ = function () {
		return i18n.__.apply(req, arguments);
	};
	let moment = require('moment');
	moment.locale(req.params.lang);
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
