const _ = require('lodash');

module.exports = function bodyChecker(valueInBody) {
  return (req, res, next) => {
    for (const value of valueInBody) {
      if (!_.has(req.body, value)) {
        return res.status(400).json({
          message: `Need all values in body (${_.reduce(
            valueInBody,
            (accumulator, currentItem) => `${accumulator} ${currentItem}`
          )})`
        });
      }
    }
    return next();
  };
};
