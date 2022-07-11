const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const EstudianteModel = require('../../../models/Estudiante');
const schemaBody = require('../../../structures/estudiante/resetPassword');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const validateBody = await schemaBody(req.body);
		if(validateBody.error)
			return res.status(400).json(validateBody);

		const { password, token } = req.body;

		const decrypt = await jwt.verify(token, process.env.KEY_PRELOGIN);

		const passwordHash = await bcrypt.hashSync(password, 12);

		await EstudianteModel.findOneAndModify(decrypt._id, { password: passwordHash });

		return res.status(200).json({ message: 'Password reset successfully' });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.use('/', handler);

module.exports = { app, handler };
