import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/orders",
      name: "list-orders",
      component: () => import("../views/OrderList.vue"),
    },
    {
      path: "/order/view/:id",
      name: "view-order",
      component: () => import("../views/OrderDetails.vue"),
    },
  ],
});

export default router;
