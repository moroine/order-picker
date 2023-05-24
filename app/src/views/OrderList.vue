<script lang="ts">

export default {
  data() {
    return {
      loading: false,
      orders: [],
      error: null,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData();
      },
      { immediate: true }
    );
  },
  methods: {
    fetchData() {
      this.error = null;
      this.orders = [];
      this.loading = true;
      fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/orders`)
        .then((res) => res.json())
        .then((result) => {
          this.orders = result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <main>
    <div style="height: 400px">
      <el-table v-loading="loading" :data="orders">
        <el-table-column fixed prop="client" label="Client" width="150" />
        <el-table-column prop="status" label="Status" width="120" />
      </el-table>
    </div>
  </main>
</template>

<style>
.el-table-v2__overlay {
  z-index: 9;
}
</style>
