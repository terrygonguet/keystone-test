var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Interestometer = new keystone.List('Interestometer');

Interestometer.add({
	interesting: { type: Types.Boolean },
	experiment: { type: Types.Text, required: true, initial: false },
	submitedAt: { type: Types.Datetime, default: Date.now },
});

/**
 * Registration
 */
Interestometer.hidden = true;
Interestometer.register();
