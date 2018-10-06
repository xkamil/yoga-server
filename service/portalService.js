const Portal = require("../model/portal");
const ApiError = require('../error').ApiError;
const ApiErrorType = require('../error').ApiErrorType;
const ObjectId = require('mongoose').Types.ObjectId;
const logger = require('../utils').getLogger();

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
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, "", err)))
        });
    },

    add: (portalData) => {
        return new Promise((resolve, reject) => {
            new Portal(portalData).save()
                .then(resolve)
                .catch(err => {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            reject(new ApiError(ApiErrorType.RESOURCE_ALREADY_EXISTS, `Portal ${newPortal.name} already exists.`, err));
                        } else if (err.name === 'ValidationError') {
                            reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, err.message, err));
                        } else {
                            reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err));
                        }
                    }
                )
        });
    },

    remove: (portalId) => {
        return new Promise((resolve, reject) => {
            Portal.deleteOne({_id: portalId})
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    update: (id, portalData) => {
        const {logo, images_top, active, sections, name, label, style} = portalData;
        return new Promise((resolve, reject) => {
            logger.debug(`Portal section ${id} with data: `, portalData);
            Portal.findByIdAndUpdate(id, {logo, images_top, active, sections, name, label, style})
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    addSection: (portalId, sectionId) => {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(portalId) || !ObjectId.isValid(sectionId)) {
                return reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, 'Invalid portal_id or section_id', null));
            }
            Portal.findByIdAndUpdate(portalId, {$addToSet: {sections: sectionId}})
                .then(portal => {
                    if (!portal) {
                        reject(new ApiError(ApiErrorType.RESOURCE_NOT_FOND, `Portal ${portalId} not found.`, null));
                    } else {
                        resolve();
                    }
                })
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, err.message, err)));
        })
    },

    removeSection: (portalId, sectionId) => {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(portalId) || !ObjectId.isValid(sectionId)) {
                return reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, 'Invalid portal_id or section_id', null));
            }
            Portal.findByIdAndUpdate(portalId, {$pullAll: {sections: [sectionId]}})
                .then(portal => {
                    if (!portal) {
                        reject(new ApiError(ApiErrorType.RESOURCE_NOT_FOND, `Portal ${portalId} not found.`, null));
                    } else {
                        resolve();
                    }
                })
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, err.message, err)));
        })
    },
};

module.exports = portalService;