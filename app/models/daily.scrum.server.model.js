/**
 * Created by ScrumTools on 11/23/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//nuevo

var DailyScrumSchema = new Schema({
    did: {
        type: String,
        trim: true
    },
    willDo: {
        type: String,
        trim: true
    },
    impediments: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

var DailyScrum = mongoose.model('DailyScrum', DailyScrumSchema);
