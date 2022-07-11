const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		token: Joi.string().required(),
		password: Joi.string().required()
	});

	return validateSchema(schema, body);
};
