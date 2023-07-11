const catchAsync = (fn) => (req, res, next) => {
    // eslint-disable-next-line no-undef
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
