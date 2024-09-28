<script setup lang="ts">
import TokenAPI from "~/modules/_Module.API/TokenAPI";

if (TokenAPI.getMinutosRestantes() > 0) {
	navigateTo("/dashboard");
} else {
	navigateTo("/login");
}
</script>

<template></template>
