<template>
  <header class="text-gray-700 body-font bg-white">
    <div
      class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
    >
      <a
        class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
      >
        <span class="ml-3 text-xl">Nuxt-Express Boilerplate</span>
      </a>
      <nav
        class="md:ml-auto flex flex-wrap items-center text-base justify-center"
      >
        <nuxt-link
          to="/"
          class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
          >Home</nuxt-link
        >
        <nuxt-link
          v-if="!isLoggedIn"
          to="/login"
          class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
          >Login</nuxt-link
        >
        <nuxt-link
          to="/profile"
          class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
          >My Profile</nuxt-link
        >
        <nuxt-link
          v-if="isAdmin"
          to="/settings"
          class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
          >Settings</nuxt-link
        >
        <a
          v-if="isLoggedIn"
          class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
          @click="logout"
          >Logout</a
        >
      </nav>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  computed: {
    isLoggedIn() {
      return this.auth().loggedIn;
    },
    isAdmin() {
      return this.auth().user.user.role === 'admin' || false;
    },
  },
  methods: {
    ...mapActions(['loggedOut']),
    ...mapGetters(['auth']),
    async logout() {
      try {
        const { user, redirect } = await this.auth();
        await this.$axios.$post('/auth/logout', {
          _id: user.user._id,
        });
        await this.loggedOut();
        await this.$router.push(redirect.login);
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
</script>
