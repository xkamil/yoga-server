const Section = require("../model/section");
const resolveErrorType = require('../error').resolveErrorType;
const logger = require('../libs/logger');

const sectionService = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            Section.find()
                .populate('data')
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            Section.findById(id)
                .populate({
                    path: 'data',
                    model: 'ContentItem'
                })
                .then(resolve)
                .catch(err => reject(err))
        });
    },

    add: (sectionData) => {
        return new Promise((resolve, reject) => {
            new Section(sectionData).save()
                .then(resolve)
                .catch(err => reject(resolveErrorType(err)))
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
                .catch(err => reject(err));
        });
    },

    update: (id, sectionData) => {
        const {active, data, name, label, styles} = sectionData;
        return new Promise((resolve, reject) => {
            logger.debug(`Updating section ${id} with: styles: \n`, JSON.stringify(sectionData, null, 3));
            Section.findByIdAndUpdate(id, {active, data, name, label, styles})
                .then(resolve)
                .catch(err => err);
        });
    }
};

module.exports = sectionService;