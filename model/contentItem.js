const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentItemSchema = new Schema(
    {
        sections: [{type: Schema.Types.ObjectId, ref: 'ContentItem'}],
        type: String,
        styles: String,
        content: Object,
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('ContentItem', contentItemSchema);