<template>
  <div>
    <h2>Home</h2>
    <button @click="logout">logout</button>
    <button @click="protectedRoute">Protected Route</button>
    <nuxt-link
      to="/profile"
      class="text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
      >Profile Page</nuxt-link
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
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
    async protectedRoute() {
      try {
        const result = await this.$axios.$get('/profile/');
        console.log(`Protected route results: ${result.status}`);
      } catch (error) {
        // console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
