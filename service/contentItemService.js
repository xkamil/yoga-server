const ContentItem = require("../model/contentItem");
const ApiError = require('../error').ApiError;
const ApiErrorType = require('../error').ApiErrorType;
const logger = require('../utils').getLogger();
const contentItemService = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            ContentItem.find()
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, "", err)))
        });
    },

    add: (contentItemData) => {
        return new Promise((resolve, reject) => {
            logger.debug(`Adding content item: `, contentItemData);
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

    remove: (contentItemId) => {
        return new Promise((resolve, reject) => {
            ContentItem.findOne({_id: contentItemId})
                .then(contentItem => {
                    if (contentItem) {
                        logger.debug(`Removing content item ${id}`);
                        return contentItem.remove();
                    }
                })
                .then(resolve)
                .catch(err => reject(new ApiError(ApiErrorType.INTERNAL_ERROR, null, err)));
        });
    },

    update: (id, contentItemData) => {
        const styles = contentItemData ? contentItemData.styles || {} : {};
        const content = contentItemData ? contentItemData.content || {} : {};

        return new Promise((resolve, reject) => {
            logger.debug(`Updating content item ${id} with: styles: `, styles, ', data: ', content);

            ContentItem.findByIdAndUpdate(id, {styles, content}, {runValidators: true})
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
    }
};

module.exports = contentItemService;