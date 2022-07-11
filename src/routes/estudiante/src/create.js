const express = require('express');
const bcrypt = require('bcrypt');
const EstudinateModel = require('../../../models/Estudiante');
const schemaCreate = require('../../../structures/estudiante/create');

const app = express.Router();

const handler = async (req, res) => {
	const validation = await schemaCreate(req.body);
	if(validation.error)
		return res.status(400).json(validation);

	try {

		const { password } = req.body;

		const passwordHash = await bcrypt.hashSync(password, 12);

		const datosEstudiante = {
			contraseñaHash: passwordHash,
			name: req.body.name,
			email: req.body.email
		};

		const estudiante = new EstudinateModel(datosEstudiante);
		const estudianteInsertId = await estudiante.insert();

		res.status(200).json({ EstudianteId: estudianteInsertId });
	} catch(error) {
		res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);
module.exports = { app, handler };
