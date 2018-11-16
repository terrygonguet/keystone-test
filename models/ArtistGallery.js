var keystone = require("keystone")
var Types = keystone.Field.Types

/**
 * ArtistGallery Model
 * ==========
 */
var ArtistGallery = new keystone.List("ArtistGallery")

ArtistGallery.add({
	user: {
		type: Types.Relationship,
		ref: "User",
		required: true,
		initial: true,
	},
	key: { type: Types.Key, required: true, initial: true },
	images: {
		type: Types.CloudinaryImages,
		autoCleanup: true,
		folder: "keystone/artists",
		initial: false,
	},
})

/**
 * Registration
 */
ArtistGallery.defaultColumns = "user, key"
ArtistGallery.register()
