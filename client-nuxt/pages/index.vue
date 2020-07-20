<template>
  <div>
    <h2>Home</h2>
    <button @click="logout">logout</button>
    <button @click="protectedRoute">Protected Route</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    const cookie = document.cookie;
    console.log(cookie);
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
