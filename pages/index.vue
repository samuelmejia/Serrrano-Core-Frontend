<script setup lang="ts">
definePageMeta({
	layout: "vacio",
	title: "Inicio",
});

import TokenAPI from "~/modules/_Module.API/TokenAPI";

if (TokenAPI.getTiempoRestanteMinutos() > 0) {
	navigateTo("/dashboard");
} else {
	navigateTo("/login");
}
</script>

<template></template>
