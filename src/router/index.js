// Composables
import { createRouter, createWebHistory } from "vue-router";
import PrivacyPolicy from "../views/PrivacyView.vue";

const routes = [
  {
    path: "/espresso-trackster/privacy/",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/espresso-trackster/",
        name: "HomeView",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
