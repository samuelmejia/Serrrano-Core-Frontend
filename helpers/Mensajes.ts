export default class Mensajes {
	constructor() {}

	static exito(texto: string, titulo: string = "OK") {
		ElNotification({
			title: titulo,
			message: texto,
			type: "success",
		});
	}

	static fallo(texto: string, titulo: string = "ERROR") {
		ElNotification({
			title: titulo,
			message: texto,
			type: "error",
		});
	}

	static advertencia(texto: string, titulo: string = "ADVERTENCIA") {
		ElNotification({
			title: titulo,
			message: texto,
			type: "warning",
		});
	}
}
