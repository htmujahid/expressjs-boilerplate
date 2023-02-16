import ajv from "../../config/ajv.js";

export function validateBody(schema) {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        const valid = validate(req.body);
        if (valid) return next();
        else {
            const error = validate.errors[0];
            console.error(error);
            return res.status(400).json({
                error: {
                    message: error.message,
                },
            });
        }
    };
}

export function validateQueryParams(schema) {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        const valid = validate(req.query);
        if (valid) return next();
        else {
            const error = validate.errors[0];
            return res.status(400).json({
                error: {
                    message: error.message,
                },
            });
        }
    };
}
