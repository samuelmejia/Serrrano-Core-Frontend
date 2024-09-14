export default class PermisosData {
	constructor() {}

	getRutasBip() {
		return [
			{
				url: "/Admin/Bip/UnidadNegocio",
				nombre: "Unidad de Negocio",
			},
			{
				url: "/Admin/Bip/Productos",
				nombre: "Productos",
			},
			{
				url: "/Admin/Bip/Estaciones",
				nombre: "Estaciones",
			},
		];
	}

	getRutasClientes() {
		return [
			{
				url: "/Admin/Clientes/SocioDeNegocio",
				nombre: "Socios de Negocio",
			},
			{
				url: "/Admin/Clientes/Usuarios",
				nombre: "Usuarios",
			},
			{
				url: "/Admin/Clientes/Descuentos",
				nombre: "Descuentos",
			},
			{
				url: "/Admin/Clientes/Permisos",
				nombre: "Permisos",
			},
			{
				url: "/Admin/Clientes/Ordenes",
				nombre: "Ordenes",
			},
			{
				url: "/Admin/Clientes/CentroActividad",
				nombre: "Centro de Actividad",
			},
		];
	}

	getRutasConfiguracion() {
		return [
			{
				url: "/Admin/Configuracion/MiCuenta",
				nombre: "Mi Cuenta",
			},
			{
				url: "/Admin/Configuracion/Adicionales",
				nombre: "Adicionales",
			},
		];
	}
}
