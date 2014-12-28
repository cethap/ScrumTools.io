'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Escritorio Schema
 */
var EscritorioSchema = new Schema({
	// Escritorio model fields   
	// ...
});

mongoose.model('Escritorio', EscritorioSchema);