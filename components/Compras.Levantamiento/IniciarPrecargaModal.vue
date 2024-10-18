<script setup lang="ts">
import Mensajes from "~/helpers/Mensajes";
import type { TInfoMarcaDomain, TInfoProveedorDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";
import { useWindowSize } from "@vueuse/core";
const { width, height } = useWindowSize();

const emit = defineEmits(["cancelar", "iniciar"]);

const stampProveedores = ref(0);
const stampMarcas = ref(0);

const proveedor = ref("");
let opcionesProveedor: { value: string; label: string }[] = [];

const servicioInformacion = new InformacionService();

onMounted(() => {
	servicioInformacion.getProveedores().then((proveedores) => {
		opcionesProveedor = proveedores.map((x) => {
			return { value: x.idProveedor, label: x.nombreProveedor };
		});

		stampProveedores.value++;
	});
});

const mostrarModalProveedores = ref(false);

const mostrarModalMarcas = ref(false);
const idProvedorSeleccionado = ref("");

const infoProveedor = ref<TInfoProveedorDomain | null>(null);
function seleccionarProveedor(proveedor: TInfoProveedorDomain) {
	console.log("seleccionarProveedor", proveedor);
	infoProveedor.value = proveedor;
	idProvedorSeleccionado.value = proveedor.idProveedor;
	mostrarModalProveedores.value = false;
}

function abrirModalMarcas() {
	if (!idProvedorSeleccionado.value || idProvedorSeleccionado.value == "") {
		Mensajes.fallo("Debe seleccionar un proveedor para poder buscar marcas");
		return;
	}

	mostrarModalMarcas.value = true;
}

const infoMarca = ref<TInfoMarcaDomain | null>(null);
function seleccionarMarca(marca: TInfoMarcaDomain) {
	console.log("seleccionarMarca", marca);
	infoMarca.value = marca;
	mostrarModalMarcas.value = false;
}

const campoModelo = ref("");

function iniciar() {
	if (!infoProveedor.value) {
		Mensajes.fallo("Debe seleccionar un proveedor");
		return;
	}
	if (!infoMarca.value) {
		Mensajes.fallo("Debe seleccionar una marca");
		return;
	}

	const enviar = {
		idProveedor: "" + infoProveedor.value.idProveedor,
		idMarca: "" + infoMarca.value.idMarca,
		modelo: "" + campoModelo.value,
	};

	emit("iniciar", enviar);
}
</script>

<template>
	<div style="border-top: 1px solid gray" class="mt-0 pt-4">
		<div class="mb-6">
			<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 1fr 3fr">
				<div class="text-center">
					<b>Proveedor</b>
					<div>
						<el-button @click="mostrarModalProveedores = true" type="info" plain><i class="fas fa-search"></i></el-button>
					</div>
				</div>
				<div>
					<span>ID</span>
					<input
						:value="infoProveedor ? infoProveedor.idProveedor : ''"
						readonly
						class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
						type="text"
					/>
				</div>
				<div>
					<span>RTN</span>
					<input
						:value="infoProveedor ? infoProveedor.rtn : ''"
						readonly
						class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
						type="text"
					/>
				</div>
				<div>
					<span>Nombre</span
					><input
						:value="infoProveedor ? infoProveedor.nombreProveedor : ''"
						readonly
						class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
						type="text"
					/>
				</div>
			</div>
		</div>
		<div class="mb-6">
			<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 1fr 1fr 2fr">
				<div class="text-center">
					<b>Marca</b>
					<div class="text-center">
						<el-button type="info" @click="abrirModalMarcas" plain><i class="fas fa-search"></i></el-button>
					</div>
				</div>
				<div>
					<span>Id</span>
					<input :value="infoMarca?.idMarca" readonly class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" type="text" />
				</div>
				<div style="grid-column: 3/5">
					<span>Nombre</span>
					<input :value="infoMarca?.nombreMarca" readonly class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" type="text" />
				</div>
				<span></span>
			</div>
		</div>
		<div class="mb-6">
			<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 1fr 1fr 2fr">
				<div class="text-center flex items-center">
					<b>Modelo:</b>
				</div>
				<div style="grid-column: 2/5">
					<span>Nombre</span>
					<input v-model="campoModelo" class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" type="text" />
				</div>
				<span></span>
			</div>
		</div>
		<div class="mt-16 mb-4 flex justify-between">
			<el-button type="warning" @click="emit('cancelar')"> Cancelar </el-button>
			<el-button type="success" @click="iniciar"> Iniciar </el-button>
		</div>
	</div>

	<el-dialog v-model="mostrarModalProveedores" title="Buscar Proveedor" :width="width <= 900 ? '80%' : '65%'">
		<BuscarProveedor @cancelar="mostrarModalProveedores = false" @proveedor-encontrado="seleccionarProveedor" />
	</el-dialog>

	<el-dialog v-model="mostrarModalMarcas" title="Buscar Marcas" :width="width <= 900 ? '75%' : '60%'">
		<BuscarMarca @cancelar="mostrarModalMarcas = false" :id-proveedor="idProvedorSeleccionado" @marca-encontrada="seleccionarMarca" />
	</el-dialog>
</template>
