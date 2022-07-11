const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/estudiante/src/enroll');
const EstudianteModel = require('../../../src/models/Estudiante');
const ComisionModel = require('../../../src/models/Comision');
const EmailModel = require('../../../modules/email/sendMail');

describe('Enroll Student api test', () => {
	afterEach(() => sandbox.restore());

	// variables
	const fakeBody = {
		email: 'ricardo.grebosz@mi.unc.edu.ar',
		materia: '6271799a2b1bd51082177a70'
	};

	const estudiante = {
		_id: '626869169a1e57b437291c6c',
		email: 'ricardo.grebosz@mi.unc.edu.ar',
		name: 'Ricardo Grebosz',
		contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
	};

	const comision = {
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4,
		docentes: [{
			_id: '62693a3f53a0924e3915db02',
			dni: 41153418,
			name: 'Ricardo Grebosz',
			materias: [Array]
		}, {
			_id: '62717ac12b1bd51082177a75',
			dni: 41153419,
			name: 'Timoteo Grebosz',
			materias: [Array]
		}],
		calificaciones: [9, 'Ricardo Grebosz', 5, 'Timoteo Grebosz'],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [{
			_id: '627193832b1bd51082177a88',
			email: 'abariciartg@gmail.com',
			name: 'Timoteo Grebosz',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}, {
			_id: '627280a92b1bd51082177a99',
			email: 'mvera@moodtechnology.com.ar',
			name: 'Marcos Vera',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}]
	};

	const comision3 = {
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4,
		docentes: [{
			_id: '62693a3f53a0924e3915db02',
			dni: 41153418,
			name: 'Ricardo Grebosz',
			materias: [Array]
		}, {
			_id: '62717ac12b1bd51082177a75',
			dni: 41153419,
			name: 'Timoteo Grebosz',
			materias: [Array]
		}],
		calificaciones: [9, 'Ricardo Grebosz', 5, 'Timoteo Grebosz'],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [{
			_id: '627193832b1bd51082177a88',
			email: 'abariciartg@gmail.com',
			name: 'Timoteo Grebosz',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}, {
			_id: '627280a92b1bd51082177a99',
			email: 'mvera@moodtechnology.com.ar',
			name: 'Marcos Vera',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}]
	};

	const comision2 = {
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4,
		docentes: [{
			_id: '62693a3f53a0924e3915db02',
			dni: 41153418,
			name: 'Ricardo Grebosz',
			materias: [Array]
		}, {
			_id: '62717ac12b1bd51082177a75',
			dni: 41153419,
			name: 'Timoteo Grebosz',
			materias: [Array]
		}],
		calificaciones: [9, 'Ricardo Grebosz', 5, 'Timoteo Grebosz'],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: [{
			_id: '627193832b1bd51082177a88',
			email: 'abariciartg@gmail.com',
			name: 'Timoteo Grebosz',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}, {
			_id: '627280a92b1bd51082177a99',
			email: 'mvera@moodtechnology.com.ar',
			name: 'Marcos Vera',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}, {
			_id: '626869169a1e57b437291c6c',
			email: 'ricardo.grebosz@mi.unc.edu.ar',
			name: 'Ricardo Grebosz',
			contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
		}]
	};

	const comision4 = {
		_id: '6271799a2b1bd51082177a70',
		materia: 'Algoritmos y Estructuras de datos',
		numero: 4,
		docentes: [{
			_id: '62693a3f53a0924e3915db02',
			dni: 41153418,
			name: 'Ricardo Grebosz',
			materias: [Array]
		}, {
			_id: '62717ac12b1bd51082177a75',
			dni: 41153419,
			name: 'Timoteo Grebosz',
			materias: [Array]
		}],
		calificaciones: [9, 'Ricardo Grebosz', 5, 'Timoteo Grebosz'],
		horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' },
		estudiantesInscriptos: []
	};

	const mail = {
		accepted: ['ricardo.grebosz@mi.unc.edu.ar'],
		rejected: [],
		envelopeTime: 581,
		messageTime: 595,
		messageSize: 247,
		response: '250 2.0.0 OK  1651673414 t13-20020a9d66cd000000b0060603221270sm5109708otm.64 - gsmtp',
		envelope: {
			from: 'abariciartg@gmail.com',
			to: ['ricardo.grebosz@mi.unc.edu.ar']
		},
		messageId: '<acda7e09-5f64-78d0-31cb-ac9d14652689@gmail.com>'
	};

	const variableVacia = null;

	context('When no error occurs', () => {
		it('Should 200 if successfully enroll', async () => {
			sandbox.stub(EstudianteModel, 'getOne').resolves(estudiante);
			sandbox.stub(ComisionModel, 'getById').resolves(comision);
			sandbox.stub(EmailModel, 'send').resolves(mail);

			const req = mockRequest(fakeBody);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, {
				message: 'Student Ricardo Grebosz successfully enrolled in the course Algoritmos y Estructuras de datos '
			});

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
			sandbox.assert.calledOnceWithExactly(ComisionModel.getById, fakeBody.materia);
		});

		it('Should 200 if is already registered', async () => {
			sandbox.stub(EstudianteModel, 'getOne').resolves(estudiante);
			sandbox.stub(ComisionModel, 'getById').resolves(comision2);

			const req = mockRequest(fakeBody);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'Student already enrolled' });

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
			sandbox.assert.calledOnceWithExactly(ComisionModel.getById, fakeBody.materia);
		});

		it('Should 200 if successfully enroll without students', async () => {
			sandbox.stub(EstudianteModel, 'getOne').resolves(estudiante);
			sandbox.stub(ComisionModel, 'getById').resolves(comision4);
			sandbox.stub(EmailModel, 'send').resolves(mail);

			const req = mockRequest(fakeBody);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, {
				message: 'Student Ricardo Grebosz successfully enrolled in the course Algoritmos y Estructuras de datos '
			});

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
			sandbox.assert.calledOnceWithExactly(ComisionModel.getById, fakeBody.materia);
		});
	});

	context('When error occurs', () => {
		context('When error in validate', () => {
			it('Should 400 if body wrong', async () => {
				sandbox.stub(EstudianteModel, 'getOne').resolves(variableVacia);
				sandbox.stub(ComisionModel, 'getOne').resolves(variableVacia);

				const req = mockRequest({ ...fakeBody, email: true });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"email" must be a string' });

				sandbox.assert.notCalled(EstudianteModel.getOne);
				sandbox.assert.notCalled(ComisionModel.getOne);
			});

			it('Should 400 if body wrong', async () => {
				sandbox.stub(EstudianteModel, 'getOne').resolves(variableVacia);
				sandbox.stub(ComisionModel, 'getOne').resolves(variableVacia);

				const req = mockRequest({ ...fakeBody, materia: true });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"materia" must be one of [string, object]' });

				sandbox.assert.notCalled(EstudianteModel.getOne);
				sandbox.assert.notCalled(ComisionModel.getOne);
			});
		});

		context('When error in db', () => {
			it('Should 404 if not found student', async () => {
				sandbox.stub(EstudianteModel, 'getOne').resolves(variableVacia);
				sandbox.stub(ComisionModel, 'getOne').resolves(variableVacia);

				const req = mockRequest(fakeBody);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'User Not Found' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
				sandbox.assert.notCalled(ComisionModel.getOne);
			});

			it('Should 404 if not found course', async () => {
				sandbox.stub(EstudianteModel, 'getOne').resolves(estudiante);
				sandbox.stub(ComisionModel, 'getById').resolves(variableVacia);

				const req = mockRequest(fakeBody);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Commission Not Found' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
				sandbox.assert.calledOnceWithExactly(ComisionModel.getById, fakeBody.materia);
			});
		});

		context('When error in program', () => {
			it('Should return 500 if method enroll fails', async () => {
				sandbox.stub(EstudianteModel, 'getOne').rejects(new Error('Error in enroll'));
				sandbox.stub(ComisionModel, 'getById').resolves(comision);

				const req = mockRequest(fakeBody);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in enroll' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
			});

			it('Should return 500 if method sendMail fails', async () => {
				sandbox.stub(EstudianteModel, 'getOne').resolves(estudiante);
				sandbox.stub(ComisionModel, 'getById').resolves(comision3);
				sandbox.stub(EmailModel, 'send').rejects(new Error('Error in sendMail'));

				const req = mockRequest(fakeBody);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in sendMail' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getOne, { email: 'ricardo.grebosz@mi.unc.edu.ar' });
				sandbox.assert.calledOnceWithExactly(ComisionModel.getById, fakeBody.materia);
				sandbox.assert.calledOnceWithExactly(EmailModel.send, 'ricardo.grebosz@mi.unc.edu.ar', 'Successfully enrolled', {
					materia: 'Algoritmos y Estructuras de datos',
					numero: 4,
					docentes: undefined,
					horarios: { lunes: '18.30 a 20.00', miercoles: '16.30 a 18.00' }
				});
			});
		});

	});
});
