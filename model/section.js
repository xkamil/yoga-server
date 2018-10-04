const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        label: {type: String, required: true},
        active: {type: Boolean, default: true},
        data: [{type: Schema.Types.ObjectId, ref: 'ContentItem'}]
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('Section', sectionSchema);