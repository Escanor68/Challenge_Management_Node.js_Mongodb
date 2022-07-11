const express = require('express');
const ComisionModel = require('../../../models/Comision');

const app = express.Router();

function esValorUnico(valor, array) {
	let contador = 0;
	array.forEach(arreglo => {
		if(arreglo.materia === valor)
			contador++;
	});
	return contador === 1;
}

const handler = async (req, res) => {
	try {
		const comisionGet = await ComisionModel.get();
		if(!comisionGet)
			return res.status(404).json({ message: 'Commission is empty' });

		const comisionesUnicas = [];
		comisionGet.forEach(comision => {
			if(esValorUnico(comision.materia, comisionGet))
				comisionesUnicas.push(comision.materia);
		});

		if(comisionesUnicas.length === 0)
			return res.status(200).json({ message: 'There are no single commissions' });

		return res.status(200).json({ message: `One-time commissions are ${comisionesUnicas}` });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };
