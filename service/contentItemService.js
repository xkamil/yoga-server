const ContentItem = require("../model/contentItem");
const ApiError = require('../error').ApiError;
const ApiErrorType = require('../error').ApiErrorType;

const contentItemService = {

    getAllContentItems: () => {
        return new Promise((resolve, reject) => {
            ContentItem.find()
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, "", err)))
        });
    },

    addContentItem: (contentItemData) => {
        return new Promise((resolve, reject) => {
            new ContentItem(contentItemData).save()
                .then(resolve)
                .catch(err => {
                        if (err.name === 'ValidationError') {
                            reject(new ApiError(ApiErrorType.VALIDATION_ERRORS, err.message, err));
                        } else {
                            reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err));
                        }
                    }
                )
        });
    },

    deleteContentItem: (contentItemId) => { //TODO remove ref from sections
        return new Promise((resolve, reject) => {
            ContentItem.deleteOne({_id: contentItemId})
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },
};

module.exports = contentItemService;