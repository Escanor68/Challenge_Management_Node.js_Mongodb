const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/comicion/src/masCursosAprobados');
const ComisionModel = require('../../../src/models/Comision');

describe('masCursosAprobados api test', () => {
	afterEach(() => sandbox.restore());

	// algunas variables
	const vacio = null;

	const comision = [{
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 1,
		docentes: [[Object], [Object]],
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
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}, {
		_id: '6284f97cf9e6cb7fd714eb4a',
		materia: 'Logica',
		numero: 1,
		docentes: [[Object], [Object]],
		calificaciones: [
			{
				'Timoteo Grebosz': 3
			},
			{
				'Ricardo Grebosz': 3
			},
			{
				'Marcos Vera': 9
			}
		],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}, {
		_id: '6284f9bef9e6cb7fd714eb4b',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 2,
		docentes: [[Object], [Object]],
		calificaciones: [
			{
				'Timoteo Grebosz': 5
			},
			{
				'Ricardo Grebosz': 3
			},
			{
				'Marcos Vera': 9
			}
		],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}];

	context('When error no occurs', () => {

		it('Should return 200 if student with the most approved courses', async () => {
			sandbox.stub(ComisionModel, 'get').resolves(comision);

			const req = mockRequest();
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'The student with the most approved courses is Marcos Vera' });

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
				assert.deepStrictEqual(res.json, { message: 'Commission is empty' });

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
