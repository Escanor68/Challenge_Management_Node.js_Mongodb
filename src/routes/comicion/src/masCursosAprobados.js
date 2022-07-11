const express = require('express');
const ComisionModel = require('../../../models/Comision');

const app = express.Router();

const handler = async (req, res) => {
	try {
		const comisionGet = await ComisionModel.get();
		if(!comisionGet)
			return res.status(404).json({ message: 'Commission is empty' });

		let estudianteMasCursos = comisionGet[0].calificaciones[0];

		comisionGet.forEach(({ calificaciones }) => {
			calificaciones.forEach(contador => {
				const [key] = Object.entries(contador);
				if(key[1] >= Object.values(contador)[0] && key[1] >= 4)
					estudianteMasCursos = contador;
			});
		});

		return res.status(200).json({ message: `The student with the most approved courses is ${Object.keys(estudianteMasCursos)}` });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
