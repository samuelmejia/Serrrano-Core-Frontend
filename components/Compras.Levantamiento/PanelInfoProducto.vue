<script setup lang="ts">
import DetallesProductoModal from "./DetallesProductoModal.vue";
import type { TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";

const props = defineProps<{
	producto: TProductoModel;
}>();
</script>

<template>
	<div class="flex gap-x-8 my-4">
		<span><b>Codigo: </b> {{ props.producto.codigo }}</span>
		<span><b>Nombre: </b> {{ props.producto.nombre }}</span>
		<span><b>Marca: </b> {{ props.producto.marca }}</span>
	</div>
	<el-tabs type="border-card">
		<el-tab-pane label="Existencia">
			<main>
				<DetallesProductoModal
					v-if="true"
					:codigo="props.producto.codigo"
					:descripcion="props.producto.nombre"
					:marca="props.producto.marca"
					:detalle-existencias="props.producto.detalleExistencias"
					:ver-precio="true"
					:ocultar-descripcion="true"
				/>
			</main>
		</el-tab-pane>
		<el-tab-pane label="Kardex">Kardex</el-tab-pane>
		<el-tab-pane label="Proveedores">Proveedores</el-tab-pane>
		<el-tab-pane label="Historico Precios">Historico Precios</el-tab-pane>
	</el-tabs>
</template>

<style></style>
