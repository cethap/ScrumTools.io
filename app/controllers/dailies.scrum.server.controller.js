/**
 * Created by ScrumTools on 11/24/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    DailyScrum = mongoose.model('DailyScrum'),
    Sprint = mongoose.model('Sprint'),
    _ = require('lodash');


/**
 * Crea un diario de scrum
 */
exports.create = function(req, res) {
    var data = { did: req.body.did,
                 willDo: req.body.willDo,
                 impediments: req.body.impediments,
                 date: req.body.date,
                 sprintId: req.params.sprintId,
                 userId: req.user._id
    };
    var dailyScrum = new DailyScrum(data);

    dailyScrum.save(function(err, doc) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).jsonp(doc);
        }
    });
};


/**
 * Lista diarios de scrum
 */
exports.list = function(req, res) {
    var query = { 'sprintId': req.params.sprintId };
    var pop = ({ path: 'userId', select: 'username' });

    DailyScrum.find(query).populate(pop).exec(function(err, dailies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dailies);
        }
    });
};


/*
 * carga diarios de scrum
 */
exports.load = function (req, res) {
    var query = { _id: req.params.dailyId };

    DailyScrum.findOne(query).exec(function (err, dailyScrum) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dailyScrum);
        }
    });
};

/*
 * Actualiza diarios de scrum
 */
exports.update = function (req, res) {
    var query = { _id: req.params.dailyId };
    var data = { did: req.body.did,
                 willDo: req.body.willDo,
                 impediments: req.body.impediments,
                 date: req.body.date
    };

    DailyScrum.findOne(query).exec(function (err, dailyScrum) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            dailyScrum = _.extend(dailyScrum, data);

            dailyScrum.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(dailyScrum);
                }
            });
        }
    });
};

/*
 * Elimina diarios de scrum
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.dailyId };

    DailyScrum.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'Diario de scrum ha sido eliminado.'});
        }
    });
};

/*
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var user = req.user;
    var query = { _id: req.params.sprintId, projectId: { $in: user.projects } };

    Sprint.findOne(query).count().exec(function(err, amount) {
        if (err) return next(err);
        if (!amount) return res.status(403).send({
            message: 'Este usuario no esta autorizado'
        });
        next();
    });
};