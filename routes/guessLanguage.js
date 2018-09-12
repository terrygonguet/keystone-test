/**
 * Searches the headers to guess user language and
 * falls back to 'en' if no known locale is found
 */
const i18n = require('i18n');

module.exports = function (req, res) {
	let acceptLang = req.header('Accept-Language');
	let langs = acceptLang.split(',');
	let locales = i18n.getLocales();
	let found = false;

	for (let lang of langs) {
		let shortlang = /^(.+?)(?:$|-|;)/.exec(lang)[1];
		if (locales.includes(shortlang)) {
			res.redirect(`/${shortlang}/`);
			found = true;
			break;
		}
	}
	if (!found) res.redirect('/en/');
	res.end();
};
