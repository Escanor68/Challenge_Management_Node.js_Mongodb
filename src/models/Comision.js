const Model = require('../../modules/class/Models');

class Comision extends Model {
	constructor({
		materia,
		numero,
		docentes = [],
		estudiantesInscriptos = [],
		calificaciones = [],
		horarios = {}
	}) {
		super();
		this.materia = materia;
		this.numero = numero;
		this.docentes = docentes;
		this.estudiantesInscriptos = estudiantesInscriptos;
		this.calificaciones = calificaciones;
		this.horarios = horarios;
	}

	static get collection() {
		return 'comisiones';
	}

	get collection() {
		return 'comisiones';
	}

	static instantiate(obj) {
		return new Comision(obj);
	}
}

module.exports = Comision;
