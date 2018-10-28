const ContentItem = require("../model/contentItem");
const resolveErrorType = require('../error').resolveErrorType;
const logger = require('../utils').getLogger();
const contentItemService = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            ContentItem.find()
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            ContentItem.findById(id)
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    add: (contentItemData) => {
        return new Promise((resolve, reject) => {
            logger.debug(`Adding content item: `, contentItemData);
            new ContentItem(contentItemData).save()
                .then(resolve)
                .catch(err => reject(resolveErrorType(err)))
        });
    },

    remove: (contentItemId) => {
        return new Promise((resolve, reject) => {
            ContentItem.findOne({_id: contentItemId})
                .then(contentItem => {
                    if (contentItem) {
                        logger.debug(`Removing content item \n ${JSON.stringify(contentItem, null, 2)}`);
                        return contentItem.remove();
                    }
                })
                .then(resolve)
                .catch(err => reject(err));
        });
    },

    update: (id, contentItemData) => {
        const {styles, content} = contentItemData;

        return new Promise((resolve, reject) => {
            logger.debug(`Updating content item ${id} with:\n ${JSON.stringify(contentItemData, null, 2)} `);

            ContentItem.findByIdAndUpdate(id, {styles, content}, {runValidators: true})
                .then(resolve)
                .catch(err => reject(resolveErrorType(err)))
        });
    }
};

module.exports = contentItemService;