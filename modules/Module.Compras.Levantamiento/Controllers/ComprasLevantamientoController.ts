import ComprasLevantamientoService from "../Services/ComprasLevantamientoService";

export default class ComprasLevantamientoController {
	public serviceListaLevantamiento;

	constructor() {
		this.serviceListaLevantamiento = new ComprasLevantamientoService();
	}
}
