import { createRouter, createWebHistory } from "vue-router";

import PharmacyDashboard from "../views/PharmacyDashboard.vue";

const routes = [{ path: "/", component: PharmacyDashboard }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
