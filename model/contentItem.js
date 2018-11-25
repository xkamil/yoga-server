const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Section = require('./section');

const contentItemSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['table', 'gallery', 'text', 'text_and_image', 'list', 'contact', 'schedule'],
            required: true
        },
        styles: {
            type: Object,
            required: true
        },
        content: {
            type: Object,
            required: true
        },
        tags: {type: Array, default: []},
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

contentItemSchema.pre('remove', function (next) {
    const contentItem = this;

    Section.updateMany({}, {$pullAll: {data: [contentItem._id]}})
        .then(() => next())
        .catch(err => console.log(JSON.stringify(err)));
});

contentItemSchema.pre('findByIdAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

module.exports = mongoose.model('ContentItem', contentItemSchema);