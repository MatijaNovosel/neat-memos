<template>
  <v-navigation-drawer
    :order="1"
    v-model="state.drawer"
    permanent
    class="pa-5 bg-grey-lighten-5"
  >
    <template #append>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Log out"
        nav
        @click="logOut"
      />
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
        <v-icon class="mr-3"> {{ navItem.icon }} </v-icon>
        {{ navItem.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import ROUTE_NAMES from "@/router/routeNames";
import { useUserStore } from "@/store/user";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const state = reactive({
  drawer: true,
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
    icon: "mdi-clock-outline",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Resources",
    icon: "mdi-paperclip",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Explore",
    icon: "mdi-earth",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Profile",
    icon: "mdi-account-outline",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Inbox",
    icon: "mdi-bell-outline",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Archived",
    icon: "mdi-archive-outline",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  },
  {
    title: "Settings",
    icon: "mdi-cogs",
    to: {
      name: ROUTE_NAMES.LOGIN
    }
  }
];

const logOut = () => {
  userStore.logOut();
  router.push({
    name: ROUTE_NAMES.LOGIN
  });
};
</script>
