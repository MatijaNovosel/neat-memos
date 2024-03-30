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
        Log out
      </v-list-item>
    </template>
    <template #prepend>
      <v-list-item
        class="text-subtitle-2"
        prepend-avatar="https://vlada.gov.hr/UserDocsImages//00%20Foto%20mobitel/Europski%20semestar/%C4%8Clanovi%20Vlade/5%20%C4%8Clanovi%20Vlade%20-%2015%20Vlada%20RH/Plenkovi%C4%87.jpg"
      >
        Matija
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
import ROUTE_NAMES from "@/router/routeNames";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay, useTheme } from "vuetify";

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const { mdAndUp } = useDisplay();
const theme = useTheme();

const state = reactive({
  drawer: mdAndUp.value ? true : false,
  rail: false
});

const navItems = [
  {
    title: "Home",
    icon: "mdi-home-outline",
    to: {
      name: ROUTE_NAMES.HOME
    }
  },
  {
    title: "Timeline",
    icon: "mdi-clock-outline"
  },
  {
    title: "Resources",
    icon: "mdi-paperclip"
  },
  {
    title: "Profile",
    icon: "mdi-account-outline"
  },
  {
    title: "Settings",
    icon: "mdi-cogs",
    to: {
      name: ROUTE_NAMES.SETTINGS
    }
  }
];

const logOut = () => {
  userStore.logOut();
  router.push({
    name: ROUTE_NAMES.LOGIN
  });
};

watch(
  () => appStore.leftDrawer,
  () => (state.drawer = !state.drawer)
);
</script>
