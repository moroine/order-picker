<script lang="ts">
// TODO: Import type from API
type OrderDetails = {
  _id: string;
  clientName: string;
  status: string;
  card: Array<{
    product: {
      name: string;
      version: number;
      ref: string;
    };
    qty: number;
  }>;
};

export default {
  data() {
    return {
      loading: false,
      order: null as null | OrderDetails,
      error: null,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      (id) => {
        this.fetchData(id as string);
      },
      { immediate: true }
    );
  },
  methods: {
    fetchData(id: string) {
      this.error = null;
      this.order = null;
      this.loading = true;
      fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/order/view/${id}`)
        .then((res) => res.json())
        .then((result) => {
          this.order = result;
        })
        .catch((error) => {
          this.error = error;
          console.error(error);
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
      <el-empty
        v-if="!loading && order === null && error === null"
        description="Not found"
      />
      <h2 v-if="order">Order {{ order._id }}</h2>
      <el-descriptions
        v-if="order"
        :column="2"
        :border="true"
      >
        <el-descriptions-item label="Client">{{
          order.clientName
        }}</el-descriptions-item>
        <el-descriptions-item label="Status">{{
          order.status
        }}</el-descriptions-item>
      </el-descriptions>
      <h3 style="margin-top: 20px;">Card</h3>
      <el-table v-if="order" v-loading="loading" :data="order.card" width="100%">
        <el-table-column prop="product.name" label="Product Name"/>
        <el-table-column prop="product.version" label="Product Version"/>
        <el-table-column prop="product.ref" label="Product Ref"/>
        <el-table-column prop="qty" label="Quantity" />
      </el-table>
    </div>
  </main>
</template>
