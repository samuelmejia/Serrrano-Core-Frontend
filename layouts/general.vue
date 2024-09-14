<script setup lang="ts">
import es from "element-plus/es/locale/lang/es";
import RuntimeService from "~/services/RuntimeService";
RuntimeService.getInstance(useRuntimeConfig());

const route = useRoute();

const isSidebarOpen = ref(false);
const sidebar = ref<HTMLElement | null>(null);

const toggleSidebar = () => {
	isSidebarOpen.value = !isSidebarOpen.value;
};

const handleClickOutside = (event: Event) => {
	if (!sidebar.value) return;
	if (!event.target) return;

	if (sidebar.value && !sidebar.value.contains(<Node>event.target)) {
		isSidebarOpen.value = false;
	}
};

const handleKeyup = (event: KeyboardEvent) => {
	if (event.key === "Escape") {
		isSidebarOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
	document.addEventListener("keyup", handleKeyup);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
	document.removeEventListener("keyup", handleKeyup);
});
</script>

<template>
	<Head>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"
			integrity="sha512-q3eWabyZPc1XTCmF+8/LuE1ozpg5xxn7iO89yfSOd5/oKvyqLngoNGsx8jq92Y8eXJ/IRxQbEC+FGSYxtk2oiw=="
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		/>
	</Head>

	<div class="flex h-screen bg-gray-100">
		<!-- Sidebar -->
		<div
			style="width: 16rem; background-color: #374151"
			:class="[
				'clase-index fixed flex flex-col inset-y-0 left-0 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out text-white',
				{ '-translate-x-full': !isSidebarOpen },
			]"
			ref="sidebar"
		>
			<SideBar />
		</div>

		<div class="min-h-full flex flex-col flex-1 overflow-y-auto" @click="handleClickOutside">
			<div class="flex items-center justify-between h-16 bg-white border-b border-gray-100 shadow-lg">
				<div class="flex items-center px-4">
					<button class="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden" @click.stop="toggleSidebar"><i style="font-size: 2rem; color: #374151" class="fas fa-bars"></i></button>
				</div>
				<div style="flex: 1">
					<b style="font-size: 1.1rem">{{ route.meta.title }}</b
					><br />
					<span style="font-size: 0.8rem">{{ route.meta.subTitle }}</span>
				</div>
				<div class="flex items-center pr-4" style="column-gap: 5px">
					<span>Nombre de Persona</span>
					<img src="/img/serrano-icon.png" style="height: 40px" />
				</div>
			</div>
			<div class="p-4 flex-1 flex flex-col">
				<main class="flex-1 p-4 bg-white shadow-lg" style="border-radius: 5px">
					<ElConfigProvider :locale="es">
						<slot />
					</ElConfigProvider>
				</main>
			</div>
		</div>
	</div>
</template>

<style>
.clase-index {
	z-index: 20 !important;
}
</style>
