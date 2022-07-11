const express = require('express');
const ComisionModel = require('../../../models/Comision');
const DocenteModel = require('../../../models/Docente');
const schemaQuery = require('../../../structures/comision/alumnosConDocente');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const validateQuery = await schemaQuery(req.query);
		if(validateQuery.error)
			return res.status(400).json(validateQuery);

		const { docente } = req.query;

		const docenteGet = await DocenteModel.getById(docente);
		if(!docenteGet)
			return res.status(404).json({ message: `Not found teacher: ${docente}` });

		const comisionesDocente = await ComisionModel.get({ docentes: { $elemMatch: { _id: docente } } });

		if(!comisionesDocente)
			return res.status(404).json({ message: 'Not found course' });

		let estudiantes = [];

		comisionesDocente.forEach(comision => {

			estudiantes = [
				...estudiantes, ...comision.estudiantesInscriptos
			];

		});

		const dataArr = new Set(estudiantes);

		const result = [...dataArr];

		return res.status(200).json({ message: `List of students with the teacher ${docenteGet.name}: ${JSON.stringify(result)}` });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
