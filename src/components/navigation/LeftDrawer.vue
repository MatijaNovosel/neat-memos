<template>
  <v-navigation-drawer
    :order="1"
    v-model="state.drawer"
    :permanent="mdAndUp"
    class="pa-5"
    :class="theme.current.value.dark ? '' : 'bg-grey-lighten-5'"
  >
    <template #append>
      <v-list-item
        class="text-subtitle-2 rounded-lg px-4"
        @click="logOut"
      >
        <v-icon class="mr-3"> mdi-logout </v-icon>
        {{ i18n.t("signOut") }}
      </v-list-item>
    </template>
    <template #prepend>
      <v-list-item
        :title="userStore.user?.userName || 'Undefined'"
        :subtitle="leftDrawerSubtitle"
        class="text-subtitle-2"
      >
        <template #prepend>
          <v-avatar color="orange">
            {{ acronym(userStore.user?.userName || "Undefined") }}
          </v-avatar>
        </template>
      </v-list-item>
    </template>
    <v-list
      density="compact"
      class="mt-3"
      nav
    >
      <v-list-item
        v-for="(navItem, i) in navItems"
        :key="i"
        exact
        class="text-subtitle-2 rounded-lg px-4"
        :to="navItem.to"
      >
        <v-icon
          color="grey"
          class="mr-3"
        >
          {{ navItem.icon }}
        </v-icon>
        {{ navItem.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { acronym } from "@/helpers/string";
import ROUTE_NAMES from "@/router/routeNames";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import { version } from "../../../package.json";

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const { mdAndUp } = useDisplay();
const theme = useTheme();
const i18n = useI18n();

const state = reactive({
  drawer: mdAndUp.value ? true : false,
  rail: false
});

const navItems = computed(() => [
  {
    title: i18n.t("links.home"),
    icon: "mdi-home-outline",
    to: {
      name: ROUTE_NAMES.HOME
    }
  },
  {
    title: i18n.t("links.timeline"),
    icon: "mdi-clock-outline",
    to: {
      name: ROUTE_NAMES.TIMELINE
    }
  },
  {
    title: i18n.t("links.resources"),
    icon: "mdi-paperclip",
    to: {
      name: ROUTE_NAMES.RESOURCES
    }
  },
  {
    title: "Archive",
    icon: "mdi-archive",
    to: {
      name: ROUTE_NAMES.ARCHIVE
    }
  },
  {
    title: "Kanban",
    icon: "mdi-view-dashboard",
    to: {
      name: ROUTE_NAMES.KANBAN
    }
  },
  {
    title: "Privacy",
    icon: "mdi-eye",
    to: {
      name: ROUTE_NAMES.PRIVACY
    }
  },
  {
    title: i18n.t("links.settings"),
    icon: "mdi-cogs",
    to: {
      name: ROUTE_NAMES.SETTINGS
    }
  }
]);

const logOut = () => {
  userStore.logOut();
  router.push({
    name: ROUTE_NAMES.LOGIN
  });
};

const leftDrawerSubtitle = computed(() => {
  return `Neat memos ${version}`;
});

watch(
  () => appStore.leftDrawer,
  () => (state.drawer = !state.drawer)
);
</script>
