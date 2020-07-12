<template>
  <div>
    <h2>Home</h2>
    <button @click="logout">logout</button>
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
        console.log(error.response.data.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
