'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Admncnvan = mongoose.model('Admncnvan'),
	_ = require('lodash');

/**
 * Create a Admncnvan
 */
exports.create = function(req, res) {
	var admncnvan = new Admncnvan(req.body);
	admncnvan.user = req.user;

	admncnvan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admncnvan);
		}
	});
};

/**
 * Show the current Admncnvan
 */
exports.read = function(req, res) {
	res.jsonp(req.admncnvan);
};

/**
 * Update a Admncnvan
 */
exports.update = function(req, res) {
	var admncnvan = req.admncnvan ;

	admncnvan = _.extend(admncnvan , req.body);

	admncnvan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admncnvan);
		}
	});
};

/**
 * Delete an Admncnvan
 */
exports.delete = function(req, res) {
	var admncnvan = req.admncnvan ;

	admncnvan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admncnvan);
		}
	});
};

/**
 * List of Admncnvans
 */
exports.list = function(req, res) { 
	Admncnvan.find().sort('-created').populate('user', 'displayName').exec(function(err, admncnvans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admncnvans);
		}
	});
};

/**
 * Admncnvan middleware
 */
exports.admncnvanByID = function(req, res, next, id) { 
	Admncnvan.findById(id).populate('user', 'displayName').exec(function(err, admncnvan) {
		if (err) return next(err);
		if (! admncnvan) return next(new Error('Failed to load Admncnvan ' + id));
		req.admncnvan = admncnvan ;
		next();
	});
};

/**
 * Admncnvan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admncnvan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
