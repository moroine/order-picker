<script lang="ts">
import router from '@/router';

// TODO: Import type from API
type ListOrdersItem = {
  _id: string;
  clientName: string;
  status: string;
};

export default {
  data() {
    return {
      loading: false,
      orders: [] as ListOrdersItem[],
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
    handleClick(order: ListOrdersItem) {
      router.push(`/order/view/${order._id}`)
    }
  },
};
</script>

<template>
  <main>
    <div style="height: 400px">
      <el-table v-loading="loading" :data="orders" @row-click="handleClick">
        <el-table-column prop="clientName" label="Client"/>
        <el-table-column prop="status" label="Status" />
      </el-table>
    </div>
  </main>
</template>
