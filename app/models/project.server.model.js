/**
 * Created by ScrumTools on 9/17/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var _ = require('lodash');
var ObjectId = mongoose.Types.ObjectId;


/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property && property.length < 31);
};

var ProjectSchema = new Schema({
    projectName: {
        type: String,
        required: [true, 'El titulo es requerido'],
        trim: true,
        validate: [validateProperty, 'El titulo del proyecto debe tener entre 1 y 30 caracteres']
    },
    descriptionName: {
        type: String,
        default: '',
        trim: true
    },
    startTime: {
        type: Date,
        required: [true, 'El inicio de tiempo del proyecto es requerido']
    },
    endTime: {
        type: Date,
        required: [true, 'El fin de tiempo del proyecto es requerido']
    },
    users: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: [{
            type: String,
            enum: ['SCRUM_MASTER', 'PRODUCT_OWNER', 'TEAM', 'STAKEHOLDER']
        }],
        admin: {
            type: Boolean,
            default: false
        },
        _id: false
    }],
    projectBurnDownChart : [{
        storyPoints: {
            type: Number
        },
        day: {
            type: Number
        },
        _id: false
    }],
    productBackLog: {
        risks: [{
            type: String,
            trim: true
        }]
    }
});

ProjectSchema.methods = {

    addUsers: function (users, callback) {
        var _this = this;
        var usersToGo = users.length;

        _.forEach(users, function (user) {
            var index = _.findIndex(_this.users, { 'userId': new ObjectId(user._id) });
            if (index === -1) {
                var u = {'userId': new ObjectId(user._id), 'role': [ user.role ]};
                _this.users.addToSet (u);
                if (--usersToGo === 0) {
                    _this.save(callback);
                }
            } else {
                callback(new Error('Usuario actualmente esta se encuentra en el proyecto'));
            }
        });
    },

    deleteUser: function (userId, callback) {
        var _this = this;

        var index = _.findIndex(_this.users, { userId: userId });
        if (~index) {
            _this.users.splice(index, 1);
            _this.save(callback);
        } else {
            callback(new Error('UserId no coincide'));
        }
    }

};

var Project = mongoose.model('Project', ProjectSchema);
