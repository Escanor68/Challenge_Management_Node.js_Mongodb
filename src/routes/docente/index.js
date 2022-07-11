const docenteModel = 'docente/';

const { app: login } = require('./src/login');

module.exports = define => {
	define(docenteModel + 'login', login);
};
