import Mensajes from "~/helpers/Mensajes";
import FetchHeaders from "~/modules/_Module.API/_FetchHeaders";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import UsuarioAPI from "~/modules/_Module.Info/UsuarioAPI";
import RuntimeService from "~/services/RuntimeService";

export default defineNuxtRouteMiddleware((to, from) => {
	if (import.meta.client) {
		const rc = useRuntimeConfig();
		RuntimeService.getInstance(rc);
		FetchHeaders.getInstance();
		FetchHeaders.actualizarTokenEnHeaders();

		const layout = <string>to.meta.layout;

		if (TokenAPI.getTiempoRestanteMinutos() <= 0) {
			Mensajes.fallo("La sesión ha expirado");
			const usuario = new UsuarioAPI();
			usuario.cerrarSesion();
			return navigateTo("/login");
		}

		if (!TokenAPI.getUsuario() && layout == "general") {
			Mensajes.fallo("No se ha iniciado sesión");
			return navigateTo("/login");
		}
	}
});
