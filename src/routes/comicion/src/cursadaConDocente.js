const express = require('express');
const areObjectEquals = require('are-objects-equals');
const EstudianteModel = require('../../../models/Estudiante');
const ComisionModel = require('../../../models/Comision');
const DocenteModel = require('../../../models/Docente');
const schemaQuery = require('../../../structures/comision/docenteEstudiante');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const validateQuery = await schemaQuery(req.query);
		if(validateQuery.error)
			return res.status(400).json(validateQuery);

		const { docente, estudiante } = req.query;

		const estudianteGet = await EstudianteModel.getById(estudiante);
		if(!estudianteGet)
			return res.status(404).json({ message: `Not found student: ${estudiante}` });

		const docenteGet = await DocenteModel.getById(docente);
		if(!docenteGet)
			return res.status(404).json({ message: `Not found teacher: ${docente}` });

		const comisiones = await ComisionModel.get();
		if(!comisiones)
			return res.status(404).json({ message: 'The course is empty' });

		const comisionDocenteEstudiante = comisiones.find(comision => {
			const docenteFound = comision.docentes.find(currentDocente => areObjectEquals(currentDocente, docenteGet));
			const estudianteFound = comision.estudiantesInscriptos.find(currentEstudiante => areObjectEquals(currentEstudiante, estudianteGet));

			if(docenteFound && estudianteFound)
				return comision;
			return null;
		});

		if(comisionDocenteEstudiante)
			return res.status(200).json({ message: `The student ${estudianteGet.name} does take a course taught by the professor ${docenteGet.name}` });

		return res.status(404).json({ message: `The student ${estudianteGet.name} does not take a course taught by the professor ${docenteGet.name}` });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
