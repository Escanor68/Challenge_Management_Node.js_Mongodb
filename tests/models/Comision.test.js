const assert = require('assert');
const ComisionModel = require('../../src/models/Comision');

const compareData = (model, data) => {
	assert.deepStrictEqual(model.materia, data.materia);
	assert.deepStrictEqual(model.numero, data.numero);
	assert.deepStrictEqual(model.docentes, data.docentes ? data.docentes : []);
	assert.deepStrictEqual(model.calificaciones, data.calificaciones ? data.calificaciones : []);
	assert.deepStrictEqual(model.horarios, data.horarios ? data.horarios : {});
	assert.deepStrictEqual(model.estudiantesInscriptos, data.estudiantesInscriptos ? data.estudiantesInscriptos : []);
};

describe('Test Course Model', () => {
	const data = {
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4,
		docentes: [
			{
				_id: '62693a3f53a0924e3915db02',
				dni: 41153418,
				name: 'Ricardo Grebosz',
				materias: ['Algoritmos y Estructuras de datos']
			}, {
				_id: '62717ac12b1bd51082177a75',
				dni: 41153419,
				name: 'Timoteo Grebosz',
				materias: ['Algoritmos y Estructuras de datos']
			}
		],
		calificaciones: [9, 'Ricardo Grebosz', 5, 'Timoteo Grebosz'],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [
			{
				_id: '627193832b1bd51082177a88',
				email: 'abariciartg@gmail.com',
				name: 'Timoteo Grebosz',
				contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
			}, {
				_id: '627280a92b1bd51082177a99',
				email: 'mvera@moodtechnology.com.ar',
				name: 'Marcos Vera',
				contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
			}
		]
	};

	const dataSinArreglos = {
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4
	};

	it('Create Course Model', async () => {
		const comisionesModel = new ComisionModel(data);
		compareData(comisionesModel, data);
	});

	it('Should return "comisiones" when execute the collection function', () => {
		const { collection } = ComisionModel;
		assert.deepStrictEqual(collection, 'comisiones');
	});

	it('Should return "comisiones" when execute the collection instantiated function', () => {
		const voiceModel = new ComisionModel(data);
		const { collection } = voiceModel;
		assert.deepStrictEqual(collection, 'comisiones');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = ComisionModel.instantiate(data);
		compareData(user, data);
	});

	it('Create Course Model without teachers, students and schedules', async () => {
		const comisionesModel = new ComisionModel(dataSinArreglos);
		compareData(comisionesModel, dataSinArreglos);
	});
});
