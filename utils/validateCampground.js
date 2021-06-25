const { campgroundSchema } = require('../utils/validate');
const Err = require('../utils/Err');

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(elm => elm.message).join(', ');
        throw new Err(msg, 400);
    } else {
        next();
    }
}
