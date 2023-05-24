<script lang="ts" setup>
import {
  ShoppingCartFull,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
  <RouterLink to="/orders">
    <el-menu-item index="1">
      <el-icon><ShoppingCartFull /></el-icon>
      <span>Orders</span>
    </el-menu-item>
  </RouterLink>
  </el-menu>
</template>