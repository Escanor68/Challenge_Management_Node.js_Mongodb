const Model = require('../../modules/class/Models');

class Estudiante extends Model {
	constructor({ email, name, contraseñaHash }) {
		super();
		this.email = email;
		this.name = name;
		this.contraseñaHash = contraseñaHash;
	}

	static get collection() {
		return 'estudiantes';
	}

	get collection() {
		return 'estudiantes';
	}

	static instantiate(obj) {
		return new Estudiante(obj);
	}
}

module.exports = Estudiante;
