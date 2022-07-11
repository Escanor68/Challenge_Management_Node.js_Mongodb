const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/comicion/src/mejoresEstudiantes');
const ComisionModel = require('../../../src/models/Comision');

describe('mejoresEstudiantes api test', () => {
	afterEach(() => sandbox.restore());

	// algunas variables
	const vacio = null;

	const comision = [
		{
			_id: '6271799a2b1bd51082177a70',
			materia: 'Algoritmos y Estructuras de datos',
			numero: 4,
			docentes: [{
				_id: '62693a3f53a0924e3915db02',
				dni: 41153418,
				name: 'Ricardo Grebosz',
				materias: [
					'Algoritmos y Estructuras de datos'
				]
			},
			{
				_id: '62717ac12b1bd51082177a75',
				dni: 41153419,
				name: 'Timoteo Grebosz',
				materias: [
					'Algoritmos y Estructuras de datos'
				]
			}],
			calificaciones: [
				{
					'Timoteo Grebosz': 5
				},
				{
					'Ricardo Grebosz': 9
				},
				{
					'Marcos Vera': 9
				}
			],
			horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
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
				},
				{
					_id: '626869169a1e57b437291c6c',
					email: 'ricardo.grebosz@mi.unc.edu.ar',
					name: 'Ricardo Grebosz',
					contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
				}
			]
		}
	];

	context('When error no occurs', () => {

		it('Should return 200 if there is only one', async () => {
			sandbox.stub(ComisionModel, 'get').resolves(comision);

			const req = mockRequest();
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'The top student is Ricardo Grebosz' });

			sandbox.assert.calledOnceWithExactly(ComisionModel.get);
		});

	});

	context('When error occurs', () => {

		context('When error in db', () => {

			it('Should 404 if not found course', async () => {
				sandbox.stub(ComisionModel, 'get').resolves(vacio);

				const req = mockRequest();
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Commission Not Found' });

				sandbox.assert.calledOnceWithExactly(ComisionModel.get);
			});
		});

		context('When error in program', () => {

			it('Should return 500 if method fails', async () => {
				sandbox.stub(ComisionModel, 'get').rejects(new Error('Error in Comision'));

				const req = mockRequest();
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in Comision' });

				sandbox.assert.calledOnceWithExactly(ComisionModel.get);
			});
		});
	});
});
