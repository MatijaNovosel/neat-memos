<template>
  <v-navigation-drawer
    :order="1"
    v-model="state.drawer"
    :rail="state.rail"
    permanen
    @click="state.rail = false"
    class="pa-5"
  >
    <template #append>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Log out"
        nav
        @click="logOut"
      />
    </template>
    <v-list-item
      prepend-avatar="https://vlada.gov.hr/UserDocsImages//00%20Foto%20mobitel/Europski%20semestar/%C4%8Clanovi%20Vlade/5%20%C4%8Clanovi%20Vlade%20-%2015%20Vlada%20RH/Plenkovi%C4%87.jpg"
      title="Matija"
      nav
    />
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :to="{
          name: ROUTE_NAMES.HOME
        }"
        prepend-icon="mdi-home"
        title="Home"
      />
      <v-list-item
        prepend-icon="mdi-clock"
        title="Timeline"
      />
      <v-list-item
        prepend-icon="mdi-attachment"
        title="Resources"
      />
      <v-list-item
        prepend-icon="mdi-earth"
        title="Explore"
      />
      <v-list-item
        prepend-icon="mdi-account"
        title="Profile"
      />
      <v-list-item
        prepend-icon="mdi-bell"
        title="Inbox"
      />
      <v-list-item
        prepend-icon="mdi-archive"
        title="Archived"
      />
      <v-list-item
        prepend-icon="mdi-cogs"
        title="Settings"
      />
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

const logOut = () => {
  userStore.logOut();
  router.push({
    name: ROUTE_NAMES.LOGIN
  });
};
</script>
