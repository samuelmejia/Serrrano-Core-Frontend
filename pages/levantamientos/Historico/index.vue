<script setup lang="ts">
import TableFull from "~/components/TableFull.vue";
import type { TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import SpinnerLoading from "~/components/SpinnerLoading.vue";
import type { TLevantamientoActualModel } from "~/modules/Module.Compras.Levantamiento/Types/TLevantamientoActualModel";
import LevantamientoHistorialService from "~/modules/Module.Compras.Levantamiento/Services/LevantamientoHistorialService";
import CarritoHistoricoSection from "./partials/CarritoHistoricoSection.vue";

import { useWindowSize } from "@vueuse/core";
const { width, height } = useWindowSize();

definePageMeta({
	layout: "general",
	title: "Historico",
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
	stampActualizacionAgregados.value++;
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

type TDataEstado = {
	id: string;
	descripcion: string;
};

const listaEstados: TDataEstado[] = [
	{ id: "3", descripcion: "FINALIZADO" },
	{ id: "7", descripcion: "APROBADO" },
	{ id: "8", descripcion: "DECLINADO" },
];

const historicoFiltrar = ref<string>("");
const historicosFiltrados = ref<TLevantamientoActualModel[]>([]);
historicoFiltrar.value = "3";

watch(historicoFiltrar, () => {
	obtenerLevantamientos();
});

function obtenerLevantamientos() {
	serviceHistorico.getListLevantamientoFiltrado(+historicoFiltrar.value).then((lista) => {
		historicosFiltrados.value = lista;
		stampActualizacionTabla.value++;
	});
	mostrarRevisadosModal.value = false;
}
obtenerLevantamientos();
</script>

<template>
	<div>
		<label>Filtrado de Levantamientos: </label>
		<select v-model="historicoFiltrar" class="bg-white border py-1 pl-1 rounded">
			<template v-for="estado of listaEstados">
				<option :value="estado.id">{{ estado.descripcion }}</option>
			</template>
		</select>
	</div>
	<TableFull
		:usar-filtrado-externo="false"
		:page-size="10"
		:key="stampActualizacionTabla"
		tam-campo-busqueda="30%"
		v-if="!!historicosFiltrados"
		:data-recibida="historicosFiltrados"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr class="tr-levantamientos-previos bg-gray-100 text-gray-700 px-4 py-3 select-none grid">
				<th v-if="width >= 900">CREADOR</th>
				<th>OBSERVACIONES</th>
				<th v-if="width >= 900">CREACION</th>
				<th>CIERRE</th>
				<th>AREA</th>
				<th>PASILLO</th>
				<th>VER</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1 tr-levantamientos-previos" :key="row.id" v-for="row of <TLevantamientoActualModel[]>dataMostrada">
				<td v-if="width >= 900" class="text-center">{{ row.usuarioResponsable }}</td>
				<td class="text-left pl-2">{{ row.observaciones }}</td>
				<td v-if="width >= 900" class="text-center">{{ row.fechaCreacion }}</td>
				<td class="text-right pr-2" style="text-wrap: nowrap">{{ !row.fechaCierre ? "N/A" : row.fechaCierre }}</td>
				<td class="text-left pl-2" style="text-wrap: nowrap">{{ row.area }}</td>
				<td class="text-center" style="text-wrap: nowrap">{{ row.pasillo }}</td>

				<td class="text-center" :key="stampActualizacionRegistros" @click="mostrarDetallesLevantamiento(row)">
					<el-button :type="historicoFiltrar == '3' ? 'warning' : historicoFiltrar == '7' ? 'success' : 'danger'" :size="width <= 900 ? 'small' : ''"><i class="fas fa-eye"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" v-model="mostrarRevisadosModal" title="Historico de Levantamiento" :width="width <= 900 ? '90%' : '80%'">
		<CarritoHistoricoSection
			:stamp-reactivo="stampActualizacionAgregados"
			:key="infoLevantamiento.id"
			v-if="!!infoLevantamiento"
			:info-levantamiento="infoLevantamiento"
			@actualizar-lista="obtenerLevantamientos"
		/>
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Levantamiento" :width="width <= 900 ? '90%' : '80%'">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">Informacion de Levantamiento</div>
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

<style lang="scss" scoped>
.tr-levantamientos-previos {
	font-size: 0.9rem;
	grid-template-columns: 1fr 4fr 1fr 1fr 1fr 1fr 1fr;
}

@media screen and (max-width: 900px) {
	.tr-levantamientos-previos {
		font-size: 0.8rem;
		grid-template-columns: 3fr 1fr 2fr 1fr 1fr;
	}
}
</style>
