<script setup lang="ts">
import Mensajes from "~/helpers/Mensajes";
import UsuarioAPI from "~/modules/_Module.Info/UsuarioAPI";
import RuntimeService from "~/services/RuntimeService";

RuntimeService.getInstance(useRuntimeConfig());

const usuarioAPI = new UsuarioAPI();

const inputLogin = ref({
	usuario: "",
	pass: "",
});

async function iniciarSesionUsuario() {
	if (inputLogin.value.usuario.toLowerCase() != "apineda") {
		Mensajes.fallo("Usuario no encontrado");
		return;
	}

	const res = await usuarioAPI.iniciarSesion(inputLogin.value.usuario, inputLogin.value.pass);

	if (!!res.status) {
		navigateTo("/dashboard");
	}
}
</script>

<template>
	<div class="py-16" style="height: 100vh; display: flex; align-items: center">
		<div class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
			<div class="hidden lg:block lg:w-1/2 bg-cover">
				<img src="/img/serrano-edificio-frontal.jpg" style="min-height: 100%; min-width: 100%; aspect-ratio: 16 / 9; object-fit: cover" />
			</div>
			<div class="w-full p-8 lg:w-1/2">
				<h2 class="text-2xl font-semibold text-gray-700 text-center">Serrano Industrial</h2>
				<p class="text-xl text-gray-600 text-center">ERP</p>

				<div class="mt-4 flex items-center justify-between">
					<span class="border-b w-full"></span>
				</div>
				<div class="mt-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
					<input
						v-model="inputLogin.usuario"
						class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
						type="email"
					/>
				</div>
				<div class="mt-4">
					<div class="flex justify-between">
						<label class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
						<a href="#" tabindex="-1" class="text-xs text-gray-500">Olvidé mi contraseña</a>
					</div>
					<input
						v-model="inputLogin.pass"
						class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
						type="password"
					/>
				</div>
				<div class="mt-8">
					<span @click="iniciarSesionUsuario" style="display: block; text-align: center" class="cursor-pointer bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
						>Ingresar</span
					>
				</div>
			</div>
		</div>
	</div>
</template>
