const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const jwt = require('jsonwebtoken');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/estudiante/src/resetPassword');
const EstudianteModel = require('../../../src/models/Estudiante');

describe('resetPassword Student api Test', () => {
	afterEach(() => sandbox.restore());
	beforeEach(() => {
		process.env.KEY_PRELOGIN = 'test';
		process.env.CADUCIDAD_TOKEN = '8h';
	});

	const datoFalso = {
		// eslint-disable-next-line max-len
		token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjcxOTM4MzJiMWJkNTEwODIxNzdhODgiLCJlbWFpbCI6ImFiYXJpY2lhcnRnQGdtYWlsLmNvbSIsIm5hbWUiOiJUaW1vdGVvIEdyZWJvc3oiLCJjb250cmFzZcOxYUhhc2giOiIkMmEkMTIkcUpkN05aM25QMktCbXpmWXhKNUlYLnJMcVIxOFZoYU90Ni9CN29mUmVUM0xwMEpwazQucDIiLCJpYXQiOjE2NTMwNjA2ODYsImV4cCI6MTY1MzA4OTQ4Nn0.2XestWNQjMC_jyqqahPTTxFUcTjG3tjCd1YbyGNRcZ8',
		password: 'JesusMaria'
	};

	const jwtId = {
		_id: '627193832b1bd51082177a88',
		email: 'abariciartg@gmail.com',
		name: 'Timoteo Grebosz',
		contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2',
		iat: 1653655140,
		exp: 1653683940
	};

	context('When no error occurs', () => {
		it('Should return 200 if resetPassword is successful', async () => {
			sandbox.stub(jwt, 'verify').resolves(jwtId);

			const req = mockRequest(datoFalso);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'Password reset successfully' });

			sandbox.assert.calledOnceWithExactly(jwt.verify, datoFalso.token, process.env.KEY_PRELOGIN);
		});
	});

	context('When error occurs', () => {
		it('Should return 400 if invalid data', async () => {
			sandbox.stub(EstudianteModel, 'getOne');

			const req = mockRequest({ ...datoFalso, password: true });
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 400);
			assert.deepStrictEqual(res.json, { error: '"password" must be a string' });

			sandbox.assert.notCalled(EstudianteModel.getOne);
		});

		it('Should return 400 if invalid data', async () => {
			sandbox.stub(EstudianteModel, 'getOne');

			const req = mockRequest({ ...datoFalso, token: true });
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 400);
			assert.deepStrictEqual(res.json, { error: '"token" must be a string' });

			sandbox.assert.notCalled(EstudianteModel.getOne);
		});

		it('Should return 500 if method resetPassword fails', async () => {
			sandbox.stub(jwt, 'verify').rejects(new Error('Error in resetPassword'));

			const req = mockRequest(datoFalso);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 500);
			assert.deepStrictEqual(res.json, { message: 'Error: Error in resetPassword' });

			sandbox.assert.calledOnceWithExactly(jwt.verify, datoFalso.token, process.env.KEY_PRELOGIN);
		});
	});
});
