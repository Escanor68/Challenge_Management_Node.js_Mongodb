const express = require('express');
const ComisionModel = require('../../../models/Comision');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const comisionGet = await ComisionModel.get();
		if(!comisionGet)
			return res.status(404).json({ message: 'Commission Not Found' });

		let mejorEstudiante = comisionGet[0].calificaciones[0];
		comisionGet.forEach(({ calificaciones }) => {
			calificaciones.forEach(calificacion => {
				const [key] = Object.entries(calificacion);
				if(key[1] > Object.values(mejorEstudiante)[0])
					mejorEstudiante = calificacion;
			});
		});

		return res.status(200).json({ message: 'The top student is ' + Object.keys(mejorEstudiante) });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
