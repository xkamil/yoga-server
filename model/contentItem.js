const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentItemSchema = new Schema(
    {
        type: {type: String, enum: ['table', 'gallery', 'text', 'text_and_image', 'list', 'contact'], required: true},
        styles: {type: Object, default: {}},
        content: {type: Object, required: true},
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('ContentItem', contentItemSchema);