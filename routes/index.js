/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require("keystone")
var middleware = require("./middleware")
var importRoutes = keystone.importer(__dirname)

// Common Middleware
keystone.pre("routes", middleware.initLocals)
keystone.pre("render", middleware.flashMessages)
keystone.pre("render", middleware.i18n)

// Import Route Controllers
var routes = {
	views: importRoutes("./views"),
	guessLanguage: require("./guessLanguage"),
	api: importRoutes("./api"),
}

// Setup Route Bindings
module.exports = function(app) {
	app.get("/", routes.guessLanguage) // decide what language to serve

	// Views
	app.get("/:lang/", routes.views.index)
	app.get("/:lang/contact", routes.views.contact)
	app.get("/:lang/about", routes.views.about)
	app.get("/:lang/news", routes.views.news)
	app.get("/:lang/science", routes.views.experiment)
	app.get("/:lang/artist/:key", routes.views.artist)

	// news
	app.get("/:lang/news/:id", routes.views.news)
	app.get("/:lang/news/tags/:tag", routes.views.tags)
	// experiment
	app.all("/api/experiment/count", routes.api.experiment)

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
}
