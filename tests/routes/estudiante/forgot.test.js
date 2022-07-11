const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/estudiante/src/forgot');
const EstudianteModel = require('../../../src/models/Estudiante');

describe('Forgot Student api Test', () => {
	afterEach(() => sandbox.restore());
	beforeEach(() => {
		process.env.KEY_PRELOGIN = 'test';
		process.env.CADUCIDAD_TOKEN = '8h';
	});

	const datoFalso = {
		email: 'ricardo.grebosz@mi.unc.edu.ar'
	};
	const falsoId = {
		_id: '626869169a1e57b437291c6c',
		email: 'ricardo.grebosz@mi.unc.edu.ar',
		name: 'Ricardo Grebosz',
		contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
	};
	const userNull = null;

	context('When no error occurs', () => {
		it('Should return 200 if forgot is successful', async () => {
			sandbox.stub(EstudianteModel, 'getOne').resolves(falsoId);

			const req = mockRequest(datoFalso);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json.Usuario, {
				_id: '626869169a1e57b437291c6c',
				email: 'ricardo.grebosz@mi.unc.edu.ar',
				name: 'Ricardo Grebosz',
				contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
			});

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
		});
	});

	context('When error occurs', () => {
		it('Should return 400 if invalid data', async () => {
			sandbox.stub(EstudianteModel, 'getOne');

			const req = mockRequest({ email: true });
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 400);
			assert.deepStrictEqual(res.json, { error: '"email" must be a string' });

			sandbox.assert.notCalled(EstudianteModel.getOne);
		});

		it('Should return 404 if not found user', async () => {
			sandbox.stub(EstudianteModel, 'getOne').resolves(userNull);

			const req = mockRequest(datoFalso);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 404);
			assert.deepStrictEqual(res.json, { message: 'User Not Found' });

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
		});

		it('Should return 500 if method forgot fails', async () => {
			sandbox.stub(EstudianteModel, 'getOne').rejects(new Error('Error in forgot'));

			const req = mockRequest(datoFalso);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 500);
			assert.deepStrictEqual(res.json, { message: 'Error: Error in forgot' });

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
		});
	});
});
