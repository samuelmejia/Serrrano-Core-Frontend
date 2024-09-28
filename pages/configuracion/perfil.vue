<script setup lang="ts">
import InfoUsuario from "./partials/InfoUsuario.vue";

definePageMeta({
	layout: "general",
	title: "Configuracion / Perfil",
	subTitle: "Perfil de Usuario",
});

import TableFull from "~/components/TableFull.vue";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
const activeTab = ref("1");

const permisos = ref<TPermisoTiendaModel[]>([]);

TokenAPI.getInstance();
permisos.value = TokenAPI.getPermisosTienda();
</script>

<template>
	<section style="display: flex; column-gap: 1rem; flex: 1">
		<InfoUsuario />
		<el-tabs v-model="activeTab" type="border-card" style="flex: 1">
			<el-tab-pane name="1" label="Almacenes Permitidos">
				<TableFull :data-recibida="permisos" :page-size="10" :usar-filtrado-externo="false">
					<template #thead="{ th }">
						<tr class="bg-orange-200 p-1 grid select-none" style="grid-template-columns: 1fr 3fr">
							<th style="text-align: center">ID</th>
							<th style="text-align: left">Nombre</th>
						</tr>
					</template>
					<template #tbody="{ dataMostrada }">
						<tr class="grid hover:bg-gray-100" style="grid-template-columns: 1fr 3fr" v-for="registro in <TPermisoTiendaModel[]>dataMostrada">
							<td style="text-align: center">{{ registro.idAlmacen }}</td>
							<td>{{ registro.nombreAlmacen }}</td>
						</tr>
					</template>
				</TableFull>
			</el-tab-pane>
		</el-tabs>
	</section>
</template>

<style>
.el-tabs__item {
	color: black !important;
}
</style>
