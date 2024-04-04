const yup = require("yup");
const Application = require("../models/application");

const validate = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      applicationId: yup.number().required(),
      motivation: yup.string().required(),
      disponibilite: yup.string().required(),
      salaire: yup.string().required(),
      applicationDate: yup.date().required(),
      email: yup.string().email().required(),
      status: yup.string().oneOf(['Under review', 'Shortlisted', 'Rejected']).required()
    });

    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      error: error.errors,
    });
  }
};

module.exports = validate;
