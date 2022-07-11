const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/comicion/src/alumnosConDocente');
const ComisionModel = require('../../../src/models/Comision');
const DocenteModel = require('../../../src/models/Docente');

describe('alumnosConDocente api test', () => {
	afterEach(() => sandbox.restore());

	// algunas variables
	const vacio = null;

	const query = {
		docente: '62693a3f53a0924e3915db02'
	};

	const docenteGet = {
		_id: '62693a3f53a0924e3915db02',
		dni: 41153418,
		name: 'Ricardo Grebosz',
		materias: ['Algoritmo']
	};

	const comisionGet = [
		{
			_id: '6271799a2b1bd51082177a70',
			materia: 'Algoritmos y Estructuras de datos',
			numero: 4,
			docentes: [
				{
					_id: '62693a3f53a0924e3915db02',
					dni: 41153418,
					name: 'Ricardo Grebosz',
					materias: [
						'Algoritmo'
					]
				},
				{
					_id: '62717ac12b1bd51082177a75',
					dni: 41153419,
					name: 'Timoteo Grebosz',
					materias: [
						'Algoritmo'
					]
				}
			],
			calificaciones: [
				9,
				'Ricardo Grebosz',
				5,
				'Timoteo Grebosz'
			],
			horarios: {
				lunes: '18.30 a 20.00',
				miercoles: '16.30 a 18.00'
			},
			estudiantesInscriptos: [
				{
					_id: '627193832b1bd51082177a88',
					email: 'abariciartg@gmail.com',
					name: 'Timoteo Grebosz',
					contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
				},
				{
					_id: '627280a92b1bd51082177a99',
					email: 'mvera@moodtechnology.com.ar',
					name: 'Marcos Vera',
					contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
				}
			]
		}
	];

	context('When error no occurs', () => {

		it('Should return 200 if have students in charge', async () => {
			sandbox.stub(ComisionModel, 'get').resolves(comisionGet);
			sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);

			const req = mockRequest({}, {}, query);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			// eslint-disable-next-line max-len
			assert.deepStrictEqual(res.json, { message: 'List of students with the teacher Ricardo Grebosz: [{"_id":"627193832b1bd51082177a88","email":"abariciartg@gmail.com","name":"Timoteo Grebosz","contraseñaHash":"$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2"},{"_id":"627280a92b1bd51082177a99","email":"mvera@moodtechnology.com.ar","name":"Marcos Vera","contraseñaHash":"$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2"}]' });

			sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			sandbox.assert.calledOnceWithExactly(ComisionModel.get, { docentes: { $elemMatch: { _id: '62693a3f53a0924e3915db02' } } });
		});
	});

	context('When error occurs', () => {

		context('When error in db', () => {

			it('Should return 400 if query teacher is wrong', async () => {
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);
				sandbox.stub(ComisionModel, 'get').resolves(comisionGet);

				const req = mockRequest({}, {}, { docente: true });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"docente" must be one of [string, object]' });

				sandbox.assert.notCalled(DocenteModel.getById);
				sandbox.assert.notCalled(ComisionModel.get);
			});

			it('Should 404 if not found teacher', async () => {
				sandbox.stub(ComisionModel, 'get').resolves(comisionGet);
				sandbox.stub(DocenteModel, 'getById').resolves(vacio);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Not found teacher: 62693a3f53a0924e3915db02' });

				sandbox.assert.notCalled(ComisionModel.get);
				sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			});

			it('Should 404 if not found course', async () => {
				sandbox.stub(ComisionModel, 'get').resolves(vacio);
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Not found course' });

				sandbox.assert.calledOnceWithExactly(ComisionModel.get, { docentes: { $elemMatch: { _id: '62693a3f53a0924e3915db02' } } });
				sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);

			});
		});

		context('When error in program', () => {

			it('Should return 500 if method fails', async () => {
				sandbox.stub(ComisionModel, 'get').rejects(new Error('Error in Comision'));
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in Comision' });

				sandbox.assert.calledOnceWithExactly(ComisionModel.get, { docentes: { $elemMatch: { _id: '62693a3f53a0924e3915db02' } } });
			});
		});
	});
});
