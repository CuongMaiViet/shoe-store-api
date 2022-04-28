const validate = {
  register: async (req, res, next) => {
    const { email, password, firstName, lastName, phone } = req.body;
    const errors = [];

    for (const key in req.body) {
      if (!req.body[key]) {
        errors.push(`Xin quý khách vui lòng điền ${key}.`);
      }
    }

    if (errors.length > 0) {
      return res.status(401).json({ msg: errors });
    }

    next();
  },
};

module.exports = validate;
