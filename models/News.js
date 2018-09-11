var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var News = new keystone.List('News');

News.add({
	name: { type: Types.Text, required: true, initial: true, label: 'Title' },
	synopsis: { type: Types.Text, note: 'Key for multi language content', initial: false },
	content: { type: Types.Text, note: 'Key for multi language content', initial: false },
	state: { type: Types.Select, options: [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Published', value: 'published' },
	], default: 'draft', required: true },
	publishedAt: { type: Date, dependsOn: { state: 'published' }, required: true, initial: false },
});

// News.schema.post('find', function (result) {
// 	async function localize (r) {
// 		let nodes = await keystone.list('TextNode').model.find({ name: r.content }).exec();
// 		r.content = {};
// 		nodes.forEach(n => (r.content[n.language] = n.content));
// 		console.log(r);
// 	}
// 	result.forEach(localize);
// });

News.schema.methods.localize = async function localize (language, name) { // name: content || synopsis
	let nodes = await keystone.list('TextNode').model.find({ language, name: this[name] }).exec();
	if (nodes.length > 1) throw new Error('What');
	else if (!nodes.length) return null;
	else return nodes[0].content;
};

/**
 * Registration
 */
News.defaultColumns = 'name, state, publishedAt';
News.register();
