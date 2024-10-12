<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";

//Conjunto de Data en las propiedades del componente
const props = defineProps<{
	pageSize: number;
	filter?: any[];
	usarFiltradoExterno: boolean;
	dataRecibida: any[];
	tamCampoBusqueda?: string;
	defaultPage?: number | null;
	defaultCampoBusqueda?: string | null;
	espacioBotones?: boolean;
}>();

const emit = defineEmits(["emitFiltradoExterno", "emitFiltradoLocal"]);

//Variables Reactivas
const campoBusqueda = ref("");
const stampActualizacionRegistros = ref(0); //Permite diferenciar cuando se actualiza la tabla, omitiendo el uso de la reactividad
const currentPage = ref(1);
const campoActualSort = ref("");
const direccionSort = ref(1); // 0 = ASC, 1 = DESC

//Variables de Data
let dataFiltrada = <object[]>[];
let dataMostrada = <object[]>[];

function setPage(val: number) {
	currentPage.value = val;
	paginarDataTabla();
}

if (!!props.defaultCampoBusqueda) {
	campoBusqueda.value = props.defaultCampoBusqueda;
}

//Funciones que afectan directamente a la data
//El filtrado revisa el arreglo y hace un test de la expresion regular del campo
//Quizas luego quieran que la busqueda sea mediante un select, pero por ahora esto es lo mas rapido
function filtrarDataTabla() {
	setPage(1);
	const regExpresion = new RegExp(`${campoBusqueda.value}.*`, "i");

	dataFiltrada = props.dataRecibida.filter((x: any) => {
		if (!props.filter) return true;

		return props.filter.some((y) => {
			const columna = Object.keys(y)[0];
			const tipo = Object.values(y)[0];
			const campo = x[columna];

			if (tipo == "number") {
				return regExpresion.test(campo.toString());
			}
			if (tipo == "array") {
				return campo.some((z: any) => regExpresion.test(z));
			}
			return regExpresion.test(campo);
		});
	});

	emit("emitFiltradoLocal");
	paginarDataTabla();
}

//La paginaicacion es sencillmente mostrar la data parcialmente
function paginarDataTabla() {
	if (!!props.defaultPage) {
		currentPage.value = props.defaultPage;

		const paginasPosibles = dataFiltrada.length == 0 ? 0 : Math.ceil(dataFiltrada.length / props.pageSize);
		if (currentPage.value > paginasPosibles) {
			currentPage.value = paginasPosibles;
		}
	}

	dataMostrada = dataFiltrada.slice(props.pageSize * currentPage.value - props.pageSize, props.pageSize * currentPage.value);
	stampActualizacionRegistros.value++;
}

//Funciones de Ordenamiento
//Indica que columna se estará utilizando para indicar el sort
function setSort(campoSort: object) {
	const campoActual = Object.keys(campoSort)[0];
	const tipoDato = Object.values(campoSort)[0];

	campoActualSort.value = campoActual;
	direccionSort.value = direccionSort.value == 0 ? 1 : 0;

	dataFiltrada = dataFiltrada.sort((a: any, b: any) => {
		if (tipoDato == "string") {
			return direccionSort.value == 0 ? a[campoActual].localeCompare(b[campoActual]) : b[campoActual].localeCompare(a[campoActual]);
		} else if (tipoDato == "number") {
			return direccionSort.value == 0 ? a[campoActual] - b[campoActual] : b[campoActual] - a[campoActual];
		} else if (tipoDato == "date") {
			return direccionSort.value == 0 ? new Date(a[campoActual]).getTime() - new Date(b[campoActual]).getTime() : new Date(b[campoActual]).getTime() - new Date(a[campoActual]).getTime();
		}

		return 0;
	});
	setPage(1);
	paginarDataTabla();
}

function mostrarLabel(labelFiltrado: object) {
	const campoActual = Object.keys(labelFiltrado)[0];
	const labelMostrar = Object.values(labelFiltrado)[0];

	return `${labelMostrar} <i class="${asignarIcono(campoActual)}"></i>`;
}

function asignarIcono(campoActual: string) {
	if (campoActual == campoActualSort.value) {
		if (direccionSort.value == 0) {
			return `text-blue-700 fas fa-sort-up`;
		} else {
			return `text-green-700 fas fa-sort-down`;
		}
	}
	return `text-gray-300 fas fa-sort`;
}

function filtradoExterno() {
	if (props.usarFiltradoExterno) {
		emit("emitFiltradoExterno", campoBusqueda.value);
	}
}

watch(campoBusqueda, filtrarDataTabla);

const refInputB = ref<HTMLInputElement | null>(null);

onMounted(() => {
	if (!!props.defaultCampoBusqueda) {
		campoBusqueda.value = props.defaultCampoBusqueda ?? "";
		refInputB.value?.focus();
	}

	filtrarDataTabla();
});
</script>

<template>
	<article>
		<div class="grid" style="grid-template-columns: 60% 40%; min-height: 3rem" v-if="!!espacioBotones">
			<div v-if="!!props.filter" class="flex items-center">
				<el-input
					ref="refInputB"
					v-model="campoBusqueda"
					@keyup.enter="filtradoExterno"
					:style="tamCampoBusqueda ? `width: ${tamCampoBusqueda}; ` : `width: 240px`"
					placeholder="Buscar"
					:suffix-icon="Search"
				/>
				<el-button v-if="!!props.filter && usarFiltradoExterno" class="ml-2" type="primary" @click="filtradoExterno">Buscar</el-button>
			</div>
			<div class="flex items-center">
				<slot name="botones"></slot>
			</div>
		</div>

		<div class="overflow-x-auto mt-2 w-full">
			<table class="table table-xs w-full border">
				<thead>
					<slot name="thead" :th="{ setSort, mostrarLabel }"></slot>
				</thead>
				<tbody class="divide-y divide-gray-100" v-if="dataMostrada.length > 0" style="display: block; min-height: 20rem">
					<slot name="tbody" :dataMostrada="dataMostrada" :paginaActual="currentPage"></slot>
				</tbody>
				<tfoot class="divide-y divide-gray-100"></tfoot>
			</table>
			<div style="width: 40%">
				<el-pagination
					class="mt-2"
					:key="stampActualizacionRegistros"
					background
					:hide-on-single-page="true"
					layout="prev, pager, ->, total, next"
					:current-page="currentPage"
					:page-size="props.pageSize"
					:total="dataFiltrada.length"
					@current-change="setPage"
				></el-pagination>
			</div>
		</div>
	</article>
</template>

<style>
.el-pager li.is-active {
	background-color: #ea580caa !important;
}
</style>
