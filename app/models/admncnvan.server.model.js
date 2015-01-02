'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Admncnvan Schema
 */
var AdmncnvanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Porfavor llene nombre del canvan',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Admncnvan', AdmncnvanSchema);