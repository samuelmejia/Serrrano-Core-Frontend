<script setup lang="ts">
import Fechas from "~/helpers/Fechas";
import Numeros from "~/helpers/Numeros";
import type { TDetalleKardexDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";
import type { TEncabezadoKardexDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";

const props = defineProps<{
	codProducto: string;
}>();

const stampDetalles = ref(0);

const servicioInfo = new InformacionService();

const encabezado = ref<TEncabezadoKardexDomain | null>(null);
let detalles: TDetalleKardexDomain[] = [];

servicioInfo.encabezadoKardex(props.codProducto).then((c) => {
	if (!!c) {
		encabezado.value = c;
	}
});

servicioInfo.detalleKardex(props.codProducto).then((c) => {
	if (!!c) {
		detalles = c;
		stampDetalles.value++;
	}
});

onMounted(() => {});
</script>

<template>
	<section class="grid grid-cols-2">
		<div class="flex flex-col" v-if="!!encabezado">
			<div class="flex">
				<span><b>Categoria: </b> {{ encabezado.idCategoria }}</span>
				<span>{{ encabezado.categoria }}</span>
			</div>
			<div class="flex">
				<span><b>Linea: </b> {{ encabezado.idLinea }}</span>
				<span>{{ encabezado.linea }}</span>
			</div>
			<div class="flex">
				<span><b>Un. Medida: </b>{{ encabezado.unidadDeMedida }} </span>
				<span>{{ encabezado.empaque }}</span>
				<span>{{ encabezado.espesor }}</span>
			</div>
		</div>
		<div class="flex flex-col items-end pr-2" style="text-align: right" v-if="!!encabezado">
			<div class="grid grid-cols-[1fr_2fr] gap-x-2 w-[15rem]">
				<b>Entradas: </b><span> {{ Numeros.convertirDecimal(encabezado.entradas, 2) }}</span>
			</div>

			<div class="grid grid-cols-[1fr_2fr] gap-x-2 w-[15rem]">
				<b>Salidas: </b><span> {{ Numeros.convertirDecimal(encabezado.salidas, 2) }}</span>
			</div>
			<div class="grid grid-cols-[1fr_2fr] gap-x-2 w-[15rem]">
				<b>Saldo: </b><span class="bg-green-300"> {{ Numeros.convertirDecimal(encabezado.saldo, 2) }}</span>
			</div>
		</div>
	</section>
	<section :key="stampDetalles">
		<TableFull :espacio-botones="false" :usar-filtrado-externo="false" :page-size="10" :data-recibida="detalles">
			<template v-slot:thead="{ th }">
				<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-4 py-3 select-none grid tr-tabla-kardex">
					<th>Bodega</th>
					<th>Doc#</th>
					<th>Fecha</th>
					<th>Hora</th>
					<th>Tipo</th>
					<th>E/S</th>
					<th>Referencia</th>
					<th>RTN</th>
					<th>Cliente</th>
					<th>Cantidad</th>
					<th>Pieza/Caja</th>
					<th>Saldo</th>
				</tr>
			</template>
			<template v-slot:tbody="{ dataMostrada }">
				<tr :key="index" class="grid py-1 tr-tabla-kardex hover:bg-gray-200" style="font-size: 0.9rem" v-for="(row, index) of <TDetalleKardexDomain[]>dataMostrada">
					<td class="text-left">
						{{ row.bodega }}
					</td>
					<td class="text-left">{{ row.docN }}</td>
					<td class="text-left">{{ row.fecha }}</td>
					<td class="text-center">{{ Fechas.horaBD_To_AMPM(row.hora) }}</td>
					<td class="text-left">{{ row.tipo }}</td>
					<td class="text-left">{{ row.tipoKardex }}</td>
					<td class="text-left">{{ row.referencia }}</td>
					<td class="text-left">{{ row.rtnCodigo }}</td>
					<td class="text-left">{{ row.cliente }}</td>
					<td class="text-right">{{ Numeros.convertirDecimal(row.cantidad, 2) }}</td>
					<td class="text-right">{{ Numeros.convertirDecimal(row.piezaCaja, 2) }}</td>
					<td class="text-right">{{ Numeros.convertirDecimal(row.saldo, 2) }}</td>
				</tr>
			</template>
		</TableFull>
	</section>
</template>

<style lang="css" scoped>
.tr-tabla-revision {
	grid-template-columns: 1fr 5fr 1fr;
}

span {
	padding: 0px 2px;
}

.tr-tabla-kardex {
	padding: 2px 4px;
	grid-template-columns: 0.75fr 1fr 1fr 1fr 3fr 1fr 2fr 2fr 3fr 0.75fr 0.75fr 0.75fr;
	font-size: 0.8rem !important;
}

.tr-detalles_no-usar {
	color: #ddd !important;

	input[type="text"] {
		user-select: none;
	}
}
</style>
