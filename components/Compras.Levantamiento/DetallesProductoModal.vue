<script setup lang="ts">
import type { TProductoDetalleExistenciasModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoDetalleExistenciasModel";

const props = defineProps<{
	codigo: string;
	descripcion: string;
	detalleExistencias: TProductoDetalleExistenciasModel[];
}>();
</script>

<template>
	<div class="flex flex-col">
		<span><b>Codigo: </b> {{ props.codigo }}</span>
		<span><b>Nombre: </b> {{ props.descripcion }}</span>
	</div>
	<TableFull :espacio-botones="true" :usar-filtrado-externo="false" :page-size="10" v-if="!!props.detalleExistencias" :data-recibida="props.detalleExistencias">
		<template v-slot:thead="{ th }">
			<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-4 py-3 select-none grid tr-tabla-detalles">
				<th>UBICACION</th>
				<th>RESERVADO</th>
				<th>TRANSITO</th>
				<th>CONFIRMADO</th>
				<th>EXISTENCIA</th>
				<th>DISPONIBLE</th>
				<th>MIN</th>
				<th>MAX</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr :key="row.codigoTienda" class="grid py-1 tr-tabla-detalles hover:bg-gray-200" style="font-size: 0.9rem" v-for="row of <TProductoDetalleExistenciasModel[]>dataMostrada">
				<td class="text-left">
					{{ row.nombreTienda }}
				</td>
				<td class="text-center">{{ row.reservado }}</td>
				<td class="text-center">{{ row.enTransito }}</td>
				<td class="text-center">{{ row.confirmado }}</td>
				<td class="text-center">{{ row.existencia }}</td>
				<td class="text-center">{{ row.disponible }}</td>
				<td class="text-center">{{ row.stockMinimo }}</td>
				<td class="text-center">{{ row.stockMaximo }}</td>
			</tr>
		</template>
	</TableFull>
</template>

<style lang="css" scoped>
.tr-tabla-revision {
	grid-template-columns: 1fr 5fr 1fr;
}

.tr-tabla-detalles {
	grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.tr-detalles_no-usar {
	color: #ddd !important;

	input[type="text"] {
		user-select: none;
	}
}
</style>
