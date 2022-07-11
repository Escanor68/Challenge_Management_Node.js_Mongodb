const express = require('express');
const jwt = require('jsonwebtoken');
const EstudianteModel = require('../../../models/Estudiante');
const schemaBody = require('../../../structures/estudiante/forgot');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const validateBody = await schemaBody(req.body);
		if(validateBody.error)
			return res.status(400).json(validateBody);

		const { email } = req.body;

		const usuarioGet = await EstudianteModel.getOne({ email });

		if(!usuarioGet)
			return res.status(404).json({ message: 'User Not Found' });

		const token = jwt.sign(usuarioGet, process.env.KEY_PRELOGIN, { expiresIn: process.env.CADUCIDAD_TOKEN });

		return res.status(200).json({
			Usuario: usuarioGet,
			Token: token
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);
module.exports = { app, handler };
