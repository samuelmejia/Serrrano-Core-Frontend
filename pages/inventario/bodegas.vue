<script setup lang="ts">
import BodegasLevantamientoService from "~/modules/Module.Compras.Levantamiento/Services/BodegasLevantamientoService";
import type { TBodegaModel } from "~/modules/Module.Compras.Levantamiento/Types/TBodegaModel";

definePageMeta({
	layout: "general",
	title: "Inventario/Bodegas",
	subTitle: "Gestion de Bodegas",
});

const stampActualizacionRegistros = ref(0);

const servicio = new BodegasLevantamientoService();
let dataBodega = <TBodegaModel[]>[];

servicio.loadData().then(() => {
	console.log("Data cargada 1", dataBodega);
	stampActualizacionRegistros.value++;
});
</script>

<template>
	<div>
		<h1>Page: Inventario/Bodegas</h1>
	</div>

	<TableFull
		:usar-filtrado-externo="false"
		:page-size="10"
		tam-campo-busqueda="30%"
		:key="stampActualizacionRegistros"
		v-if="!!servicio.getAllBodegas()"
		:data-recibida="servicio.getAllBodegas()"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { codigoBarras: 'array' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr class="uppercase bg-gray-50 text-gray-700 px-4 py-3 select-none grid" style="font-size: 0.9rem; grid-template-columns: 1fr 3fr 1fr 3fr">
				<th>Cod</th>
				<th>Nombre</th>
				<th>CodSucursal</th>
				<th>Nombre Sucursal</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1" :key="stampActualizacionRegistros" style="font-size: 0.9rem; grid-template-columns: 1fr 3fr 1fr 3fr" v-for="row of <TBodegaModel[]>dataMostrada">
				<td class="text-center">{{ row.codigo }}</td>
				<td class="text-left">{{ row.nombre }}</td>
				<td class="text-center">{{ row.codSucursal }}</td>
				<td class="text-left">{{ row.sucursal }}</td>
			</tr>
		</template>
	</TableFull>
</template>

<style scoped></style>
