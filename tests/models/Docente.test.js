const assert = require('assert');
const DocenteModel = require('../../src/models/Docente');

const compareData = (model, data) => {
	assert.deepStrictEqual(model.name, data.name);
	assert.deepStrictEqual(model.dni, data.dni);
	assert.deepStrictEqual(model.materias, data.materias ? data.materias : []);
};

describe('Test Teacher Model', () => {
	const data = {
		_id: '62693a3f53a0924e3915db02',
		dni: 41153418,
		name: 'Ricardo Grebosz',
		materias: [
			'Algoritmo'
		]
	};

	const dataSinMateria = {
		_id: '62693a3f53a0924e3915db02',
		dni: 41153418,
		name: 'Ricardo Grebosz'
	};

	it('Create Teacher Model', async () => {
		const docentesModel = new DocenteModel(data);
		compareData(docentesModel, data);
	});

	it('Should return "docentes " when execute the collection function', () => {
		const { collection } = DocenteModel;
		assert.deepStrictEqual(collection, 'docentes');
	});

	it('Should return "docentes " when execute the collection instantiated function', () => {
		const voiceModel = new DocenteModel(data);
		const { collection } = voiceModel;
		assert.deepStrictEqual(collection, 'docentes');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = DocenteModel.instantiate(data);
		compareData(user, data);
	});

	it('Create Teacher Model without matter', async () => {
		const docentesModel = new DocenteModel(dataSinMateria);
		compareData(docentesModel, dataSinMateria);
	});
});
