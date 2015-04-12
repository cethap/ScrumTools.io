/**
 * Created by ScrumTools on 10/7/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property && property.length < 17);
};

var PhaseSchema = new Schema({
    phaseName: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'El titulo de la fase debe estar entre 0 y 16 caracteres']
    },
    position: {
        type: Number,
        required: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    }
});

var Phase = mongoose.model('Phase', PhaseSchema);
