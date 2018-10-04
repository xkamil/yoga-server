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

module.exports = {
    ApiErrorType,
    ApiError
};
