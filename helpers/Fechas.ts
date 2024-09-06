export default class Fechas {
	static ISO_To_String(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		const formattedDate = `${year}-${month}-${day}`;
		return formattedDate;
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
		return Fechas.ISO_To_String(date);
	}

	static Inicio_Mes_Actual(): string {
		const date = new Date();
		date.setDate(1);

		return Fechas.ISO_To_String(date);
	}

	static Inicio_Anho_Actual(): string {
		const date = new Date();
		date.setMonth(0);
		date.setDate(1);

		return Fechas.ISO_To_String(date);
	}

	static monthsComplete = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	static mesesShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

	static mesesComplete = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
}
