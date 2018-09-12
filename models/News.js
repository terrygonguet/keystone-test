var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var News = new keystone.List('News');

News.add({
	name: { type: Types.Text, required: true, initial: true, label: 'Title', note: 'Will be overriden by TextNode' },
	content: { type: Types.Text, note: 'Key for multi language content', initial: false },
	state: { type: Types.Select, options: [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Published', value: 'published' },
	], default: 'draft', required: true },
	publishedAt: { type: Date, dependsOn: { state: 'published' }, required: true, initial: false },
});

// News.schema.methods.localize = async function localize (language, name) { // name: content || synopsis
// 	let nodes = await keystone.list('TextNode').model.find({ language, name: this[name] }).exec();
// 	if (nodes.length > 1) throw new Error('What');
// 	else if (!nodes.length) return null;
// 	else return nodes[0].content;
// };

/**
 * Registration
 */
News.defaultColumns = 'name, state, publishedAt';
News.defaultSort = '-publishedAt';
News.register();
