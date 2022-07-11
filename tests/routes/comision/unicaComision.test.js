const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/comicion/src/unicaComision');
const ComisionModel = require('../../../src/models/Comision');

describe('mejoresEstudiantes api test', () => {
	afterEach(() => sandbox.restore());

	// algunas variables
	const vacio = null;

	const comicionGet = [{
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 1,
		docentes: [[Object], [Object]],
		calificaciones: [[Object], [Object], [Object]],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}, {
		_id: '6284f97cf9e6cb7fd714eb4a',
		materia: 'Logica',
		numero: 1,
		docentes: [[Object], [Object]],
		calificaciones: [[Object], [Object], [Object]],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}, {
		_id: '6284f9bef9e6cb7fd714eb4b',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 2,
		docentes: [[Object], [Object]],
		calificaciones: [[Object], [Object], [Object]],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}];

	const comicionGet2 = [{
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 1,
		docentes: [[Object], [Object]],
		calificaciones: [[Object], [Object], [Object]],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}, {
		_id: '6284f9bef9e6cb7fd714eb4b',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 2,
		docentes: [[Object], [Object]],
		calificaciones: [[Object], [Object], [Object]],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [[Object], [Object], [Object]]
	}];

	context('When error no occurs', () => {

		it('Should return 200 if are unique commissions', async () => {
			sandbox.stub(ComisionModel, 'get').resolves(comicionGet);

			const req = mockRequest();
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'One-time commissions are Logica' });

			sandbox.assert.calledOnceWithExactly(ComisionModel.get);
		});

		it('Should return 200 if are not unique commissions', async () => {
			sandbox.stub(ComisionModel, 'get').resolves(comicionGet2);

			const req = mockRequest();
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'There are no single commissions' });

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
