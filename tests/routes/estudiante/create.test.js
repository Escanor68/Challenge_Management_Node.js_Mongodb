const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/estudiante/src/create');
const EstudianteModel = require('../../../src/models/Estudiante');

describe('Create Student api test', () => {
	afterEach(() => sandbox.restore());

	const body = {
		name: 'Daniel Grebosz',
		email: 'danielgrebosz@gmail.com',
		password: 'Colonia'
	};

	const falsoId = {
		acknowledged: true,
		insertedId: '6296189bed00efe14209b080'
	};

	const variableVacia = null;

	context('When no error occurs', () => {
		it('Should 200 if successfully create', async () => {
			sandbox.stub(EstudianteModel.prototype, 'insert').resolves(falsoId);

			const req = mockRequest(body);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, {
				EstudianteId: {
					acknowledged: true,
					insertedId: '6296189bed00efe14209b080'
				}
			});

			sandbox.assert.calledOnceWithExactly(EstudianteModel.prototype.insert);
		});
	});

	context('When error occurs', () => {
		context('When error in validate', () => {
			it('Should 400 if body wrong', async () => {
				sandbox.stub(EstudianteModel.prototype, 'insert').resolves(falsoId);

				const req = mockRequest({ ...body, email: true });
				const res = mockResponse();

				await handler(req, res);
				// assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"email" must be a string' });

				sandbox.assert.notCalled(EstudianteModel.prototype.insert);
			});

			it('Should 400 if body wrong', async () => {
				sandbox.stub(EstudianteModel.prototype, 'insert').resolves(variableVacia);

				const req = mockRequest({ ...body, name: true });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"name" must be a string' });

				sandbox.assert.notCalled(EstudianteModel.prototype.insert);
			});

			it('Should 400 if body wrong', async () => {
				sandbox.stub(EstudianteModel.prototype, 'insert').resolves(variableVacia);

				const req = mockRequest({ ...body, password: true });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"password" must be a string' });

				sandbox.assert.notCalled(EstudianteModel.prototype.insert);
			});
		});
		context('When error in program', () => {
			it('Should return 500 if method insert fails', async () => {
				sandbox.stub(EstudianteModel.prototype, 'insert').rejects(new Error('Error in Insert'));

				const req = mockRequest(body);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in Insert' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.prototype.insert);
			});
		});
	});
});
