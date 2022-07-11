const comisionModule = 'comision/';

const { app: docenteEstudiante } = require('./src/cursadaConDocente');
const { app: cuantosDocentesParaEstudiantes } = require('./src/cuantosDocentesParaEstudiantes');
const { app: alumnosConDocente } = require('./src/alumnosConDocente');
const { app: mejoresEstudiantes } = require('./src/mejoresEstudiantes');
const { app: masCursosAprobados } = require('./src/masCursosAprobados');
const { app: unicaComision } = require('./src/unicaComision');

module.exports = define => {
	define(comisionModule + 'docenteEstudiante', docenteEstudiante);
	define(comisionModule + 'cuantosDocentesParaEstudiantes', cuantosDocentesParaEstudiantes);
	define(comisionModule + 'alumnosConDocente', alumnosConDocente);
	define(comisionModule + 'mejoresEstudiantes', mejoresEstudiantes);
	define(comisionModule + 'masCursosAprobados', masCursosAprobados);
	define(comisionModule + 'unicaComision', unicaComision);
};
