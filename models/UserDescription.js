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
	description: { type: Types.Html, wysiwig: true },
})

/**
 * Registration
 */
UserDescription.defaultColumns = "user, locale"
UserDescription.register()
