import { createRouter, createWebHistory } from "vue-router";

import RedzonesListView from "@/views/RedzonesListView.vue";
import RedzonesFormView from "@/views/RedzonesFormView.vue";
import DashboardView from "@/views/DashboardView.vue";
import AreaListView from "@/views/AreaListView.vue";
import AreaFormView from "@/views/AreaFormView.vue";
import LoginView from "@/views/LoginView.vue";
import RecoverPasswordView from "@/views/RecoverPasswordView.vue";
import UpdatePasswordView from "@/views/UpdatePasswordView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

import saveStorage from "@/utils/saveStorage";

import { usuarioStore } from "@/stores/usuarioStore";
import UserFormView from "@/views/UserFormView.vue";
import UserListView from "@/views/UserListView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: DashboardView,
      meta: {
        users: [1, 2, 3],
      },
    },
    {
      path: "/redzones",
      name: "redzones",
      component: RedzonesListView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/redzones/create",
      name: "create redzone",
      component: RedzonesFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/redzones/update/:id",
      name: "update redzone",
      component: RedzonesFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/area/create",
      name: "create area",
      component: AreaFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/area",
      name: "area",
      component: AreaListView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/area/update/:id",
      name: "update area",
      component: AreaFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/user",
      name: "user",
      component: UserListView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/user/create",
      name: "create user",
      component: UserFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/user/update/:id",
      name: "update user",
      component: UserFormView,
      meta: {
        users: [1],
      },
    },
    {
      path: "/auth",
      name: "login",
      component: LoginView,
    },
    {
      path: "/recover-password",
      name: "recover password",
      component: RecoverPasswordView,
    },
    {
      path: "/update-password",
      name: "update password",
      component: UpdatePasswordView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not found",
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { usuario } = usuarioStore();

  if (to.matched.some((record) => record.meta.users)) {
    if (usuario) {
      if ((to.meta.users as number[]).includes(usuario.idPapel)) {
        next();
      } else {
        next({ name: "not found" });
      }
    } else {
      saveStorage("toPath", { toPath: to.path }, "session");
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
