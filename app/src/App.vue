<script setup lang="ts">
import { RouterView } from "vue-router";
import SideNav from "./components/SideNav.vue";
</script>

<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <SideNav />
      </el-aside>
      <el-main><RouterView /></el-main>
    </el-container>
  </div>
</template>
