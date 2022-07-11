const assert = require('assert');
const EstudianteModel = require('../../src/models/Estudiante');

const compareData = (model, data) => {
	assert.deepStrictEqual(model.name, data.name);
	assert.deepStrictEqual(model.email, data.email);
	assert.deepStrictEqual(model.contraseñaHash, data.contraseñaHash);
};

describe('Test Student Model', () => {
	const data = {
		name: 'Ricardo Grebosz',
		email: 'ricardo.grebosz@mi.unc.edu.ar',
		contraseñaHash: '$2a$12$WqbaVfLvK2WnTHVZF1Lt8ennTIJYq3fg1ys.I5qoN8mclrG.JyCaK'
	};

	it('Create Student Model', async () => {
		const estudianteModel = new EstudianteModel(data);
		compareData(estudianteModel, data);
	});

	it('Should return "estudiante" when execute the collection function', () => {
		const { collection } = EstudianteModel;
		assert.deepStrictEqual(collection, 'estudiantes');
	});

	it('Should return "estudiante" when execute the collection instantiated function', () => {
		const voiceModel = new EstudianteModel(data);
		const { collection } = voiceModel;
		assert.deepStrictEqual(collection, 'estudiantes');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = EstudianteModel.instantiate(data);
		compareData(user, data);
	});
});
