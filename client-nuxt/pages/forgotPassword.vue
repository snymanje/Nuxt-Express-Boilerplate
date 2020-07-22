<template>
  <div class="flex items-center justify-center">
    <form class="bg-white rounded pt-6 pb-8 mb-4 w-full md:w-1/2">
      <div class="mb-4">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            id="email"
            v-model="login.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
          />
          <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
        </div>
        <div class="flex flex-col items-center">
          <button
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="forgotPassword"
          >
            Send
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
        email: '',
      },
    };
  },
  methods: {
    ...mapActions(['loggedIn']),
    ...mapGetters(['auth']),
    async forgotPassword() {
      console.log('Resetting password');
      try {
        await this.$axios.$post('/auth/forgotPassword', {
          email: this.login.email,
        });
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
};
</script>
