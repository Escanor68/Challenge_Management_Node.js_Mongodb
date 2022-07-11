const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		contraseña: Joi.string().required(),
		email: Joi.string().required()
	});

	return validateSchema(schema, body);
};
