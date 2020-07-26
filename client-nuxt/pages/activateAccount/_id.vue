<template>
  <div class="flex items-center justify-center">
    <form class="bg-white rounded pt-6 pb-8 mb-4 w-full md:w-1/2">
      <div class="mb-4">
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="login.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
          />
          <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
            >Confirm Password</label
          >
          <input
            id="passwordConfirm"
            v-model="login.passwordConfirm"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
          />
          <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
        </div>
        <div class="flex flex-col items-center">
          <button
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="resetPassword"
          >
            Reset Password
          </button>
          <nuxt-link
            to="/"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4"
            >Cancel</nuxt-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      login: {
        password: '',
        passwordConfirm: '',
      },
    };
  },
  methods: {
    ...mapActions(['loggedIn']),
    ...mapGetters(['auth']),
    async resetPassword() {
      const token = this.$route.params.id;
      try {
        await this.$axios.$patch(`auth/resetPassword/${token}`, {
          password: this.login.password,
          passwordConfirm: this.login.passwordConfirm,
        });
        const user = await this.$axios.$get('/user/getCurrentUser');
        await this.loggedIn(user);
        const authState = await this.auth();
        if (authState.loggedIn === true) {
          this.$router.push(authState.redirect.home);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
};
</script>
