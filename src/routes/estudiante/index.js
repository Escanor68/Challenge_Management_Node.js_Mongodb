const estudianteModule = 'estudiante/';

const { app: login } = require('./src/login');
const { app: forgot } = require('./src/forgot');
const { app: resetPassword } = require('./src/resetPassword');
const { app: create } = require('./src/create');

module.exports = define => {
	define(estudianteModule + 'login', login);
	define(estudianteModule + 'forgot', forgot);
	define(estudianteModule + 'resetPassword', resetPassword);
	define(estudianteModule + 'create', create);
};
