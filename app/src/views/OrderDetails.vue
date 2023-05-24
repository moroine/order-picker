<script lang="ts">
// TODO: Import type from API
type OrderDetails = {
  _id: string;
  clientName: string;
  status: "pending" | "processing" | "done";
  card: Array<{
    product: {
      name: string;
      version: number;
      ref: string;
    };
    qty: number;
  }>;
  packages: Array<{
    _id: string;
    items: string[];
    status: "pending" | "sent" | "received";
  }>;
};

export default {
  data() {
    return {
      loading: false,
      loadingPackages: false,
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
    createPackage() {
      const id = this.$route.params.id;
      this.loadingPackages = true;

      fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/order/${id}/package`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((result) => {
          if (this.order?._id === id) {
            this.order.packages = result;
          }
        })
        .catch((error) => {
          this.error = error;
          console.error(error);
        })
        .finally(() => {
          this.loadingPackages = false;
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
      <el-descriptions v-if="order" :column="2" :border="true">
        <el-descriptions-item label="Client">{{
          order.clientName
        }}</el-descriptions-item>
        <el-descriptions-item label="Status">{{
          order.status
        }}</el-descriptions-item>
      </el-descriptions>
      <h3 style="margin-top: 20px">Card</h3>
      <el-table
        v-if="order"
        v-loading="loading"
        :data="order.card"
        width="100%"
      >
        <el-table-column prop="product.name" label="Product Name" />
        <el-table-column prop="product.version" label="Product Version" />
        <el-table-column prop="product.ref" label="Product Ref" />
        <el-table-column prop="qty" label="Quantity" />
      </el-table>
      <h3 style="margin-top: 20px">Packages</h3>
      <div v-if="order">
        <el-card
          class="box-card"
          v-loading="loading"
          v-for="pkg in order.packages"
          :key="pkg._id"
        >
          <template #header>
            <div class="card-header">
              <el-tag>{{ pkg.status }}</el-tag>
              <span>Package {{ pkg._id }} </span>
              <!-- <el-button v-if="pkg.status === 'pending'" class="button" text>Send</el-button> -->
            </div>
          </template>
          <div v-for="i in pkg.items" :key="i" class="text item">{{ i }}</div>
        </el-card>

        <el-button :loading="loadingPackages" v-on:click="createPackage">Add Package</el-button>
      </div>
    </div>
  </main>
</template>
