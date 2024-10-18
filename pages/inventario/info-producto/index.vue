<script setup lang="ts">
import PanelInfoProducto from "~/components/Compras.Levantamiento/PanelInfoProducto.vue";
import ProductosAPI from "~/modules/Module.Compras.Levantamiento/API/ProductosAPI";
import type { TProductoDetalleExistenciasModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoDetalleExistenciasModel";

import DetallesProductoModal from "~/components/Compras.Levantamiento/DetallesProductoModal.vue";
import Kardex from "~/components/Compras.Levantamiento/Kardex.vue";

definePageMeta({
	layout: "general",
	title: "Información de Producto",
	subTitle: "Ver movimiento de productos",
});

const stampExistencias = ref(0);
const route = useRoute();
const codProducto = ref("" + route.query.codProducto);

const detalleExistencias = ref<TProductoDetalleExistenciasModel[]>([]);

const productoAPI = new ProductosAPI();

productoAPI.GET_DetalleProducto(codProducto.value).then((data) => {
	detalleExistencias.value = data;
	stampExistencias.value++;
});

const mostrarVentana = ref(true);
</script>

<template>
	<el-dialog v-model="mostrarVentana" width="90%" :close-on-click-modal="false">
		<div class="flex gap-x-8 my-4">
			<span><b>Codigo: </b> {{ codProducto }}</span>
		</div>
		<el-tabs type="border-card">
			<el-tab-pane label="Existencia">
				<main :key="stampExistencias">
					<DetallesProductoModal
						v-if="true"
						:codigo="codProducto"
						descripcion="props.producto.nombre"
						marca="props.producto.marca"
						:detalle-existencias="detalleExistencias"
						:ver-precio="true"
						:ocultar-descripcion="true"
					/>
				</main>
			</el-tab-pane>
			<el-tab-pane label="Kardex">
				<Kardex :cod-producto="codProducto" />
			</el-tab-pane>
			<el-tab-pane label="Proveedores">Proveedores</el-tab-pane>
			<el-tab-pane label="Historico Precios">Historico Precios</el-tab-pane>
		</el-tabs>
	</el-dialog>
</template>
