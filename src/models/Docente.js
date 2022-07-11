const Model = require('../../modules/class/Models');

class Docente extends Model {
	constructor({ dni, name, materias = [] }) {
		super();
		this.dni = dni;
		this.name = name;
		this.materias = materias.length ? materias : [];
	}

	static get collection() {
		return 'docentes';
	}

	get collection() {
		return 'docentes';
	}

	static instantiate(obj) {
		return new Docente(obj);
	}
}

module.exports = Docente;
