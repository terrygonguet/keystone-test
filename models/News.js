var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var News = new keystone.List('News');

News.add({
	name: { type: Types.Text, required: true, initial: true, label: 'Title' },
	locale: { type: Types.Text, required: true, initial: true, label: 'Language' },
	content: { type: Types.Html, wysiwyg: true, initial: false },
	synopsis: { type: Types.Html, wysiwyg: true, initial: false },
	tags: { type: Types.TextArray },
	state: { type: Types.Select, options: [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Published', value: 'published' },
	], default: 'draft', required: true },
	publishedAt: { type: Date, dependsOn: { state: 'published' }, required: true, initial: false },
});

/**
 * Registration
 */
News.defaultColumns = 'name, locale, state, publishedAt';
News.defaultSort = '-publishedAt';
News.register();
