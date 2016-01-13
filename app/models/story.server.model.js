/**
 * Created by ScrumTools on 10/4/14.
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
    return (property && property.length < 21);
};

var StorySchema = new Schema({
    storyTitle: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'El titulo de la historia debe estar entre 0 y 21 caracteres']
    },
    storyDescription: {
        type: String,
        required: true,
        trim: true
    },
    storyValue: {
        type: Number,
        required: true
    },
    storyPoint: {
        type: Number,
        required: true
    },
    storyPriority: {
        type: String,
        enum: ['Imprescindible', 'Importante', 'Buena', 'Excluida']
        //enum: ['TENDRIA', 'DEBERIA', 'PODRIA', 'NO SERA']
    },
    storyRuleValidation: [{
        type: String
    }],
    storyFinished: {
        type: Boolean,
        default: false
    },
    storyPosX: {
        type: Number,
        required: true
    },
    storyPosY: {
        type: Number,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    }
});

var Story = mongoose.model('Story', StorySchema);
