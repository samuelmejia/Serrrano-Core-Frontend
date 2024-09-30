<script setup lang="ts">
import TableFull from "~/components/TableFull.vue";
import type { TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import SpinnerLoading from "~/components/SpinnerLoading.vue";
import type { TLevantamientoActualModel } from "~/modules/Module.Compras.Levantamiento/Types/TLevantamientoActualModel";
import LevantamientoHistorialService from "~/modules/Module.Compras.Levantamiento/Services/LevantamientoHistorialService";
import CarritoHistoricoSection from "./partials/CarritoHistoricoSection.vue";

definePageMeta({
	layout: "general",
	title: "Levantamientos",
	subTitle: "Ver y utilizar los levantamientos realizados",
});

const loadingState = reactive({
	mostrar: false,
	texto: "",
});

const stampActualizacionTabla = ref(0);
const stampActualizacionRegistros = ref(0);
const stampActualizacionAgregados = ref(0);

const serviceHistorico = new LevantamientoHistorialService();

serviceHistorico.loadLevantamientos().then(() => {
	stampActualizacionTabla.value++;
	stampActualizacionRegistros.value++;
});

async function mostrarDetallesLevantamiento(levantamiento: TLevantamientoActualModel) {
	mostrarRevisadosModal.value = true;
	infoLevantamiento.value = levantamiento;
}

const infoLevantamiento = ref<TLevantamientoActualModel | null>(null);
const mostrarRevisadosModal = ref(false);
const mostrarDetallesModal = ref(false);

function actualizarListaAgregados() {
	stampActualizacionRegistros.value++;
}

watch(mostrarRevisadosModal, (newValue) => {
	if (newValue) actualizarListaAgregados();
});
</script>

<template>
	<TableFull
		:usar-filtrado-externo="false"
		:page-size="10"
		:key="stampActualizacionTabla"
		tam-campo-busqueda="30%"
		v-if="!!serviceHistorico.getListLevantamientos()"
		:data-recibida="serviceHistorico.getListLevantamientos()"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr class="tr-levantamientos-previos bg-gray-100 text-gray-700 px-4 py-3 select-none grid">
				<th>CREADOR</th>
				<th>OBSERVACIONES</th>
				<th>CREACION</th>
				<th>CIERRE</th>
				<th>AREA</th>
				<th>PASILLO</th>
				<th>VER</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1 tr-levantamientos-previos" :key="row.id" v-for="row of <TLevantamientoActualModel[]>dataMostrada">
				<td class="text-center">{{ row.usuarioResponsable }}</td>
				<td class="text-left">{{ row.observaciones }}</td>
				<td class="text-center">{{ row.fechaCreacion }}</td>
				<td class="text-right pr-6" style="text-wrap: nowrap">{{ !row.fechaCierre ? "En Proceso" : row.fechaCierre }}</td>
				<td class="text-right pr-6" style="text-wrap: nowrap">{{ row.area }}</td>
				<td class="text-right pr-6" style="text-wrap: nowrap">{{ row.pasillo }}</td>

				<td class="text-center" :key="stampActualizacionRegistros" @click="mostrarDetallesLevantamiento(row)">
					<el-button type="warning"><i class="fas fa-eye"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" v-model="mostrarRevisadosModal" title="Historico de Levantamiento" width="90%">
		<CarritoHistoricoSection :stamp-reactivo="stampActualizacionAgregados" v-if="!!infoLevantamiento" :info-levantamiento="infoLevantamiento" />
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Levantamiento" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">Informacion de Levantamiento</div>
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

<style lang="scss" scoped>
.tr-levantamientos-previos {
	font-size: 0.9rem;
	grid-template-columns: 2fr 5fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
