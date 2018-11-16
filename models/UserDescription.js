var keystone = require("keystone")
var Types = keystone.Field.Types

/**
 * UserDescription Model
 * ==========
 */
var UserDescription = new keystone.List("UserDescription")

UserDescription.add({
	user: {
		type: Types.Relationship,
		ref: "User",
		required: true,
		initial: true,
	},
	locale: {
		type: Types.Text,
		required: true,
		initial: true,
		label: "Language",
	},
	description: { type: Types.Html, wysiwyg: true },
	showInAbout: { type: Types.Boolean, default: false },
})

/**
 * Registration
 */
UserDescription.defaultColumns = "user, locale, showInAbout"
UserDescription.register()
