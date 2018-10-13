const ApiErrorType = {
    INTERNAL_ERROR: {
        http_status: 500
    },

    RESOURCE_NOT_FOND: {
        http_status: 404
    },

    RESOURCE_ALREADY_EXISTS: {
        http_status: 409
    },

    VALIDATION_ERRORS: {
        http_status: 400
    }
};

function ApiError(type, message, extra) {
    this.type = type;
    this.message = message;
    this.extra = extra;

    return this;
}

function resolveErrorType(err) {
    switch (err.name) {
        case 'ValidationError' :
            return new ApiError(ApiErrorType.VALIDATION_ERRORS, err.message, err);
        case 'MongoError' :
            return err.code === 11000 ? new ApiError(ApiErrorType.RESOURCE_ALREADY_EXISTS, err.message, err) : err;
        default:
            return err;
    }
}

module.exports = {
    ApiErrorType,
    ApiError,
    resolveErrorType
};
