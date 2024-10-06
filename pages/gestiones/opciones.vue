<script setup lang="ts">
definePageMeta({
	layout: "general",
	title: "Gestiones Derivadas",
	subTitle: "Ver las gestiones subyacentes de los levantamientos, lo que se quiere hacer con esa data",
});
</script>

<template>
	<b>Gestiones derivadas</b>
	<div class="my-2 mx-4">
		<ul>
			<li>Movimiento entre almacenes / ubicaciones</li>
			<li>Solicitud de Cotizacion (consultar proveedores)</li>
			<li>Ajuste de Inventario (salida/entrada)</li>
		</ul>
	</div>
</template>

<style>
li {
	list-style: disc;
	padding: 5px 0px;
}
</style>
