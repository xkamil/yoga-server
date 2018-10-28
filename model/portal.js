const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portalSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        description: {type: String, default: ""},
        label: {type: String, required: true},
        logo: {type: String, default: null},
        images_top: {type: Array, default: []},
        style: {type: Object, default: {}},
        active: {type: Boolean, default: true},
        sections: [{type: Schema.Types.ObjectId, ref: 'Section'}]
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('Portal', portalSchema);