import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "../layouts/Main.vue";
import { useUserStore } from "../store/user";
import ROUTE_NAMES from "./routeNames";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: ROUTE_NAMES.LOGIN,
        component: () => import("../views/Login.vue"),
        meta: {
          title: "login.title"
        }
      },
      {
        path: "register",
        name: ROUTE_NAMES.REGISTER,
        component: () => import("../views/Register.vue"),
        meta: {
          title: "register.title"
        }
      },
      {
        path: "home",
        name: ROUTE_NAMES.HOME,
        component: () => import("../views/Home.vue"),
        meta: {
          title: "home.title",
          auth: true
        }
      },
      {
        path: "settings",
        name: ROUTE_NAMES.SETTINGS,
        component: () => import("../views/Settings.vue"),
        meta: {
          title: "settings.title",
          auth: true
        }
      },
      {
        path: "memo/:id",
        name: ROUTE_NAMES.MEMO,
        component: () => import("../views/MemoDetails.vue"),
        meta: {
          title: "memo.title"
        }
      },
      {
        path: "privacy",
        name: ROUTE_NAMES.PRIVACY,
        component: () => import("../views/Privacy.vue"),
        meta: {
          title: "privacy.title",
          auth: true
        }
      },
      {
        path: "resources",
        name: ROUTE_NAMES.RESOURCES,
        component: () => import("../views/Resources.vue"),
        meta: {
          title: "resources.title",
          auth: true
        }
      },
      {
        path: "timeline",
        name: ROUTE_NAMES.TIMELINE,
        component: () => import("../views/Timeline.vue"),
        meta: {
          title: "timeline.title",
          auth: true
        }
      },
      {
        path: "archive",
        name: ROUTE_NAMES.ARCHIVE,
        component: () => import("../views/Archive.vue"),
        meta: {
          title: "archive.title",
          auth: true
        }
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/NotFound.vue")
      }
    ]
  }
];

const router = createRouter({
  routes,
  history: createWebHashHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: "nav-item active"
});

router.beforeEach((to, _, next) => {
  const userStore = useUserStore();
  if (userStore.user && to.name === ROUTE_NAMES.LOGIN) {
    next({
      name: ROUTE_NAMES.HOME
    });
  } else if (!userStore.user && to.meta.auth) {
    next({
      name: ROUTE_NAMES.LOGIN
    });
  } else {
    next();
  }
});

export default router;
