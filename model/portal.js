const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portalSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        label: {type: String, required: true},
        logo: {type: String, required: false, default: null},
        style: {type: Object, required: false, default: {}},
        active: {type: Boolean, default: true},
        sections: [{type: Schema.Types.ObjectId, ref: 'Section'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Portal', portalSchema);