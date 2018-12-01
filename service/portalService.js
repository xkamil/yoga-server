const Portal = require("../model/portal");
const resolveErrorType = require('../error').resolveErrorType;
const logger = require('../libs/logger');

const portalService = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            Portal.find()
                .populate({
                    path: 'sections',
                    model: 'Section',
                    populate: {
                        path: 'data',
                        model: 'ContentItem'
                    }
                })
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            Portal.findById(id)
                .populate({
                    path: 'sections',
                    model: 'Section',
                    populate: {
                        path: 'data',
                        model: 'ContentItem'
                    }
                })
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    add: (portalData) => {
        return new Promise((resolve, reject) => {
            new Portal(portalData).save()
                .then(resolve)
                .catch(err => reject(resolveErrorType(err)))
        });
    },

    remove: (portalId) => {
        return new Promise((resolve, reject) => {
            Portal.deleteOne({_id: portalId})
                .then(resolve)
                .catch(err => reject(err));
        });
    },

    update: (id, portalData) => {
        const {logo, images_top, active, sections, name, label, style, description} = portalData;
        return new Promise((resolve, reject) => {
            logger.debug(`Portal section ${id} with data: `, portalData);
            Portal.findByIdAndUpdate(id, {logo, images_top, active, sections, name, label, style, description})
                .then(resolve)
                .catch(err => reject(err));
        });
    }
};

module.exports = portalService;