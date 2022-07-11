const express = require('express');
const ComisionModel = require('../../../models/Comision');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const comisionGet = await ComisionModel.get();
		if(!comisionGet)
			return res.status(404).json({ message: 'Commission Not Found' });

		for(const comision of comisionGet) {
			const cuantosDocentesParaEstudiantes = comision.estudiantesInscriptos.length / (comision.docentes.length * 20);

			if(cuantosDocentesParaEstudiantes > comision.docentes.length)
				// eslint-disable-next-line max-len
				return res.status(200).json({ message: `There are fewer female teachers than necessary in the course with id = ${comision._id}, name = ${comision.materia} and number = ${comision.numero}` });

		}

		return res.status(200).json({ message: 'All commissions are fine in the teacher-student relationship' });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
