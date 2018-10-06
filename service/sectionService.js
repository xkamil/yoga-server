const Section = require("../model/section");
const ApiError = require('../error').ApiError;
const ApiErrorType = require('../error').ApiErrorType;
const ObjectId = require('mongoose').Types.ObjectId;
const logger = require('../utils').getLogger();

const sectionService = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            Section.find()
                .populate('data')
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, "", err)))
        });
    },

    add: (sectionData) => {
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

    remove: (sectionId) => {
        return new Promise((resolve, reject) => {
            Section.findOne({_id: sectionId})
                .then(section=>{
                    if(section){
                        return section.remove();
                    }
                })
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    update: (id, sectionData) => {
        const {active, data, name, label, styles} = sectionData;
        return new Promise((resolve, reject) => {
            logger.debug(`Updating section ${id} with: styles: `, styles, ', data: ', data);
            Section.findByIdAndUpdate(id, {active, data, name, label, styles})
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    addContentItem: (sectionId, contentItemId) => {
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

    removeContentItem: (sectionId, contentItemId) => {
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