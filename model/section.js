const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Portal = require('./portal');

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

sectionSchema.pre('remove', function (next) {
    const section = this;

    Portal.updateMany({}, {$pullAll: {sections: [section._id]}})
        .then(() => next())
        .catch(err => console.log(JSON.stringify(err)));
});

module.exports = mongoose.model('Section', sectionSchema);