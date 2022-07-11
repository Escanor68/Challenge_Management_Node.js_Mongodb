const express = require('express');
const EstudianteModel = require('../../../models/Estudiante');
const ComisionModel = require('../../../models/Comision');
const SendEmail = require('../../../../modules/email/sendMail');
const schemaBody = require('../../../structures/Estudiante/enroll');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const validateBody = await schemaBody(req.body);
		if(validateBody.error)
			return res.status(400).json(validateBody);

		const { email, materia } = req.body;

		const estudienteGet = await EstudianteModel.getOne({ email });
		if(!estudienteGet)
			return res.status(404).json({ message: 'User Not Found' });

		const comisionGet = await ComisionModel.getById(materia);
		if(!comisionGet)
			return res.status(404).json({ message: 'Commission Not Found' });

		const existeEstudiante = comisionGet.estudiantesInscriptos.length ?
			comisionGet.estudiantesInscriptos.find(estudiante => estudiante.email === email) : false;

		if(!existeEstudiante) {
			comisionGet.estudiantesInscriptos.push(estudienteGet);
			await ComisionModel.findOneAndModify(comisionGet._id, comisionGet);
		} else
			return res.status(200).json({ message: 'Student already enrolled' });

		const datosParaElMail = {
			materia: comisionGet.materia,
			numero: comisionGet.numero,
			docentes: comisionGet.docentes.name,
			horarios: comisionGet.horarios
		};

		await SendEmail.send(estudienteGet.email, 'Successfully enrolled', datosParaElMail);

		return res.status(200).json({ message: `Student ${estudienteGet.name} successfully enrolled in the course ${comisionGet.materia} ` });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);

module.exports = { app, handler };
