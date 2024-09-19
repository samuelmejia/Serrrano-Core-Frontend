<script setup lang="ts">
import Mensajes from "~/helpers/Mensajes";
import TokenAPI from "~/modules/_Module.API/TokenAPI";

function cerrarSesion() {
	Mensajes.advertencia("Cerrando sesion");

	setTimeout(() => {
		if (!!window.localStorage) {
			localStorage.clear();
			sessionStorage.clear();
			location.href = "/";
		}
	}, 1000);
}
</script>

<template>
	<div class="flex items-center justify-center h-16">
		<span class="font-bold uppercase">SERRANO INDUSTRIAL</span>
	</div>
	<div style="height: 80%; font-size: 0.9rem" class="flex flex-col flex-1 overflow-y-auto">
		<nav class="flex-1 px-2 py-4">
			<NuxtLink to="/dashboard" class="flex items-center px-4 py-1 mt-1 bg-[#4441] hover:bg-gray-200 hover-text-orange-600"> <i class="mr-2 fas fa-chart-line"></i> Dashboard</NuxtLink>
			<div class="flex justify-center py-1">
				<span style="border: 1px solid #ea580c; display: block; width: 80%"></span>
			</div>
			<div class="">
				<ul class="select-none">
					<li>
						<details class="group">
							<summary class="cursor-pointer select-none flex items-center justify-between w-full px-4 py-1 mt-1 focus:outline-none hover:bg-gray-200 hover-text-orange-600">
								<span class="flex items-center"> <i class="mr-2 fas fa-edit"></i>Compras:Levantamiento</span>

								<i class="group-open:rotate-180 fas fa-chevron-up"></i>
							</summary>
							<div class="accordion-content ml-6" style="border-left: 1px solid">
								<NuxtLink to="/compras/productos" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Ver Productos</NuxtLink>
								<NuxtLink to="/compras/levantamientos" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Levantamientos</NuxtLink>
								<NuxtLink to="/compras/gestiones" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Gestiones Derivadas</NuxtLink>
							</div>
						</details>
					</li>

					<li>
						<details class="group">
							<summary class="cursor-pointer select-none flex items-center justify-between w-full px-4 py-1 mt-1 focus:outline-none hover:bg-gray-200 hover-text-orange-600">
								<span class="flex items-center"> <i class="mr-2 fas fa-check"></i>Compras:Aprobaciones</span>

								<i class="group-open:rotate-180 fas fa-chevron-up"></i>
							</summary>
							<div class="accordion-content ml-6" style="border-left: 1px solid">
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Opcion 2.1</a>
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Opcion 2.2</a>
							</div>
						</details>
					</li>

					<li>
						<details class="group">
							<summary class="cursor-pointer select-none flex items-center justify-between w-full px-4 py-1 mt-1 focus:outline-none hover:bg-gray-200 hover-text-orange-600">
								<span class="flex items-center"> <i class="mr-2 fas fa-truck"></i>Compras:Recepciones</span>

								<i class="group-open:rotate-180 fas fa-chevron-up"></i>
							</summary>
							<div class="accordion-content ml-6" style="border-left: 1px solid">
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Opcion 3.1</a>
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Opcion 3.2</a>
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Opcion 3.3</a>
							</div>
						</details>
					</li>
					<div class="flex justify-center py-1">
						<span style="border: 1px solid #ea580c; display: block; width: 80%"></span>
					</div>
					<li>
						<details class="group">
							<summary class="cursor-pointer select-none flex items-center justify-between w-full px-4 py-1 mt-1 focus:outline-none hover:bg-gray-200 hover-text-orange-600">
								<span class="flex items-center"> <i class="mr-2 fas fa-boxes"></i>Inventario</span>

								<i class="group-open:rotate-180 fas fa-chevron-up"></i>
							</summary>
							<div class="accordion-content ml-6" style="border-left: 1px solid">
								<a href="/inventario/bodegas" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Sucursales / Bodegas</a>
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Productos</a>
							</div>
						</details>
					</li>

					<li>
						<details class="group">
							<summary class="cursor-pointer select-none flex items-center justify-between w-full px-4 py-1 mt-1 focus:outline-none hover:bg-gray-200 hover-text-orange-600">
								<span class="flex items-center"> <i class="mr-2 fas fa-cog"></i>Configuración</span>

								<i class="group-open:rotate-180 fas fa-chevron-up"></i>
							</summary>
							<div class="accordion-content ml-6" style="border-left: 1px solid">
								<a href="#" class="flex items-center px-4 py-1 mt-1 hover:bg-gray-200 hover-text-orange-600">Usuarios</a>
							</div>
						</details>
					</li>
				</ul>
			</div>
		</nav>
		<div class="px-2 py-4 select-none">
			<span class="flex px-2 py-1 items-center hover:bg-gray-200 cursor-pointer hover-text-orange-600" @click="cerrarSesion"> <i class="mx-2 rotate-180 fas fa-sign-out-alt"></i> Cerrar Sesión</span>
		</div>
	</div>
</template>

<style scoped>
.accordion-content {
	transition: max-height 0.3s ease;
}
.rotate-180 {
	transform: rotate(180deg);
}

.text-black-hover:hover {
	color: black;
}

.hover-text-orange-600:hover {
	color: #ea580c;
}

.hover-text-orange-600:hover > * {
	color: #ea580c;
}

.hover-text-orange-600:hover + i {
	color: #ea580c;
}
</style>
