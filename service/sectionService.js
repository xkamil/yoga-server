const Section = require("../model/section");
const ApiError = require('../error').ApiError;
const ApiErrorType = require('../error').ApiErrorType;
const ObjectId = require('mongoose').Types.ObjectId;

const sectionService = {

    getAllSections: () => {
        return new Promise((resolve, reject) => {
            Section.find()
                .populate('data')
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, "", err)))
        });
    },

    addSection: (sectionData) => {
        return new Promise((resolve, reject) => {
            new Section(sectionData).save()
                .then(resolve)
                .catch(err => {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            reject(new ApiError(ApiErrorType.RESOURCE_ALREADY_EXISTS, `Section ${sectionData.name} already exists.`, err));
                        } else if (err.name === 'ValidationError') {
                            reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, err.message, err));
                        } else {
                            reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err));
                        }
                    }
                )
        });
    },

    deleteSection: (sectionId) => { //TODO remove section ref from portal
        return new Promise((resolve, reject) => {
            Section.deleteOne({_id: sectionId})
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    addContentItemToSection: (sectionId, contentItemId) => {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(sectionId) || !ObjectId.isValid(contentItemId)) {
                return reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, 'Invalid section_id or contentItemId', null));
            }
            Section.findByIdAndUpdate(sectionId, {$addToSet: {data: contentItemId}})
                .then(portal => {
                    if (!portal) {
                        reject(new ApiError(ApiErrorType.RESOURCE_NOT_FOND, `Section ${sectionId} not found.`, null));
                    } else {
                        resolve();
                    }
                })
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, err.message, err)));
        })
    },

    removeContentItemFromSection: (sectionId, contentItemId) => {
        return new Promise((resolve, reject) => {
            if (!ObjectId.isValid(contentItemId) || !ObjectId.isValid(sectionId)) {
                return reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, 'Invalid portal_id or section_id', null));
            }
            Section.findByIdAndUpdate(sectionId, {$pullAll: {data: [contentItemId]}})
                .then(portal => {
                    if (!portal) {
                        reject(new ApiError(ApiErrorType.RESOURCE_NOT_FOND, `Section ${sectionId} not found.`, null));
                    } else {
                        resolve();
                    }
                })
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, err.message, err)));
        })
    },
};

module.exports = sectionService;