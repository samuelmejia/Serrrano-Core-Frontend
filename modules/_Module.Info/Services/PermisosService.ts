import PermisosData from "../Data/PermisosData";

export default class PermisosService {
	dataSource;
	constructor() {
		this.dataSource = new PermisosData();
	}

	getRutasBip() {
		return this.dataSource.getRutasBip();
	}

	getRutasClientes() {
		return this.dataSource.getRutasClientes();
	}

	getRutasConfiguracion() {
		return this.dataSource.getRutasConfiguracion();
	}
}
