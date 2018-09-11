var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var TextNode = new keystone.List('TextNode');

TextNode.add({
	name: { type: Types.Text, required: true, initial: true, label: 'Key' },
	language: { type: Types.Text, required: true, initial: true },
	content: { type: Types.Html, wysiwyg: true, initial: false },
});

TextNode.schema.pre('save', async function (next) {
	let nodes = await keystone.list('TextNode').model.find({ name: this.name, language: this.language }).exec();
	return next(nodes.length > 1 ? new Error('Key/language pair should be unique') : null);
});

/**
 * Registration
 */
TextNode.defaultColumns = 'name, language';
TextNode.register();
