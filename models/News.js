var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var News = new keystone.List('News');

News.add({
	name: { type: Types.Text, required: true, initial: true, label: 'Title' },
	content: { type: Types.Html, required: true, wysiwyg: true, initial: false },
	state: { type: Types.Select, options: [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Published', value: 'published' },
	], default: 'draft', required: true },
	publishedAt: { type: Date, dependsOn: { state: 'published' }, required: true, initial: false },
});


/**
 * Registration
 */
News.defaultColumns = 'name, state, publishedAt';
News.register();
