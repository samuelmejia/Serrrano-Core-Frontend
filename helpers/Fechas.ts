export default class Fechas {
	static Date_To_String(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
	}

	static Time_To_String(date: Date) {
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const tt = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${tt}`;

		return formattedTime;
	}

	static String_To_Timestamp(fecha: string): number {
		const date = new Date(fecha);
		return date.getTime();
	}

	static Fecha_0(): string {
		return "2020-01-01";
	}

	static Fecha_Actual(): string {
		const date = new Date();
		return Fechas.Date_To_String(date);
	}

	static Inicio_Mes_Actual(): string {
		const date = new Date();
		date.setDate(1);

		return Fechas.Date_To_String(date);
	}

	static Inicio_Anho_Actual(): string {
		const date = new Date();
		date.setMonth(0);
		date.setDate(1);

		return Fechas.Date_To_String(date);
	}

	static horaBD_To_AMPM(hora24: string) {
		let [get_hora, minutos, segundos] = hora24.split(":");

		let periodo = "AM";
		let hora = parseInt(get_hora);

		if (hora >= 12) {
			periodo = "PM";
			if (hora > 12) {
				hora -= 12;
			}
		} else if (hora === 0) {
			hora = 12;
		}

		return `${hora < 10 ? "0" : ""}${hora}:${minutos}${periodo}`;
	}

	static monthsComplete = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	static mesesShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

	static mesesComplete = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
}
