const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockRequest, mockResponse } = require('../../mocks');

const { handler } = require('../../../src/routes/comicion/src/cursadaConDocente');
const EstudianteModel = require('../../../src/models/Estudiante');
const ComisionModel = require('../../../src/models/Comision');
const DocenteModel = require('../../../src/models/Docente');

describe('Enroll Student api test', () => {
	afterEach(() => sandbox.restore());

	// algunas variables
	const estudianteGet = {
		_id: '626869169a1e57b437291c6c',
		email: 'ricardo.grebosz@mi.unc.edu.ar',
		name: 'Ricardo Grebosz',
		contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
	};
	const docenteGet = {
		_id: '62693a3f53a0924e3915db02',
		dni: 41153418,
		name: 'Ricardo Grebosz',
		materias: ['Algoritmo']
	};
	const comisionesGet = [{
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
	}];
	const estudianteGet2 = {
		_id: '627193832b1bd51082177a88',
		email: 'abariciartg@gmail.com',
		name: 'Timoteo Grebosz',
		contraseñaHash: '$2a$12$qJd7NZ3nP2KBmzfYxJ5IX.rLqR18VhaOt6/B7ofReT3Lp0Jpk4.p2'
	};
	const query = {
		docente: '62693a3f53a0924e3915db02',
		estudiante: '627193832b1bd51082177a88'
	};
	const variableVacia = null;

	context('When no error occurs', () => {
		it('Should 200 if found commission that is the teacher and the student', async () => {
			sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet2);
			sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);
			sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);

			const req = mockRequest({}, {}, query);
			const res = mockResponse();

			await handler(req, res);
			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: 'The student Timoteo Grebosz does take a course taught by the professor Ricardo Grebosz' });

			sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, query.estudiante);
			sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			sandbox.assert.calledOnceWithExactly(ComisionModel.get);
		});
	});

	context('When error occurs', () => {

		context('When error in query', () => {

			it('Should return 400 if query student is wrong', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet2);
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);
				sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);

				const req = mockRequest({}, {}, { estudiante: true, docente: '62693a3f53a0924e3915db02' });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"estudiante" must be one of [string, object]' });

				sandbox.assert.notCalled(EstudianteModel.getById);
				sandbox.assert.notCalled(DocenteModel.getById);
				sandbox.assert.notCalled(ComisionModel.get);
			});

			it('Should return 400 if query teacher is wrong', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet2);
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);
				sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);

				const req = mockRequest({}, {}, { docente: true, estudiante: '62693a3f53a0924e3915db02' });
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"docente" must be one of [string, object]' });

				sandbox.assert.notCalled(EstudianteModel.getById);
				sandbox.assert.notCalled(DocenteModel.getById);
				sandbox.assert.notCalled(ComisionModel.get);
			});

		});

		context('When error in db', () => {
			it('Should 404 if not found student', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(variableVacia);
				sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Not found student: 627193832b1bd51082177a88' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, '627193832b1bd51082177a88');
				sandbox.assert.notCalled(ComisionModel.get);
				sandbox.assert.notCalled(DocenteModel.getById);
			});

			it('Should 404 if not found course', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet);
				sandbox.stub(ComisionModel, 'get').resolves(variableVacia);
				sandbox.stub(DocenteModel, 'getById').resolves(estudianteGet);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'The course is empty' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, query.estudiante);
				sandbox.assert.calledOnceWithExactly(ComisionModel.get);
				sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			});

			it('Should 404 if not found teacher', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet);
				sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);
				sandbox.stub(DocenteModel, 'getById').resolves(variableVacia);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Not found teacher: 62693a3f53a0924e3915db02' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, query.estudiante);
				sandbox.assert.notCalled(ComisionModel.get);
				sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			});

			it('Should 404 if not take a course', async () => {
				sandbox.stub(EstudianteModel, 'getById').resolves(estudianteGet);
				sandbox.stub(ComisionModel, 'get').resolves(comisionesGet);
				sandbox.stub(DocenteModel, 'getById').resolves(docenteGet);

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, {
					message: `The student ${estudianteGet.name} does not take a course taught by the professor ${docenteGet.name}`
				});

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, query.estudiante);
				sandbox.assert.calledOnceWithExactly(ComisionModel.get);
				sandbox.assert.calledOnceWithExactly(DocenteModel.getById, query.docente);
			});
		});

		context('When error in program', () => {
			it('Should return 500 if method fails', async () => {
				sandbox.stub(EstudianteModel, 'getById').rejects(new Error('Error in Estudiante'));
				sandbox.stub(ComisionModel, 'get').rejects(new Error('Error in Comision'));
				sandbox.stub(DocenteModel, 'getById').rejects(new Error('Error in Docente'));

				const req = mockRequest({}, {}, query);
				const res = mockResponse();

				await handler(req, res);
				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in Estudiante' });

				sandbox.assert.calledOnceWithExactly(EstudianteModel.getById, query.estudiante);
			});
		});

	});
});
