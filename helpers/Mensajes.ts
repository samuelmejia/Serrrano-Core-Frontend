export default class Mensajes {
	constructor() {}

	static exito(texto: string) {
		ElNotification({
			title: "OK",
			message: texto,
			type: "success",
		});
	}

	static fallo(texto: string) {
		ElNotification({
			title: "ERROR",
			message: texto,
			type: "error",
		});
	}

	static advertencia(texto: string) {
		ElNotification({
			title: "ADVERTENCIA",
			message: texto,
			type: "warning",
		});
	}
}
