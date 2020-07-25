<template>
  <div>
    <navbar />
    <div class="px-4">
      <h1 class="mt-8 text-xl font-medium">Profile Data</h1>
      <p class="mt-1">Name: {{ user.name }}</p>
      <p class="mt-1">Email: {{ user.email }}</p>
    </div>
    <div class="px-4">
      <form class="rounded pt-6 pb-8 mb-4 w-64">
        <div class="mb-4">
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="currentPassword"
              >Current Password</label
            >
            <input
              id="currentPassword"
              v-model="updatepwd.passwordCurrent"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
              >Password</label
            >
            <input
              id="password"
              v-model="updatepwd.password"
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
              v-model="updatepwd.passwordConfirm"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
            />
            <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
          </div>
          <div class="flex flex-col items-center">
            <button
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              @click="updatePassword"
            >
              Update Password
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: 'Nothing yet',
      updatepwd: {
        passwordCurrent: null,
        password: null,
        passwordConfirm: null,
      },
    };
  },
  async created() {
    try {
      const user = await this.$axios.$get('/user/getCurrentUser');
      this.user =
        user.user.method === 'local' ? user.user.local : user.user.google;
    } catch (error) {
      // console.log(error);
    }
  },

  methods: {
    ...mapGetters(['auth']),
    async updatePassword() {
      try {
        await this.$axios.$patch('/auth/updateMyPassword', {
          id: this.auth().user.user._id,
          passwordCurrent: this.updatepwd.passwordCurrent,
          password: this.updatepwd.password,
          passwordConfirm: this.updatepwd.passwordConfirm,
        });
        console.log('Password updated');
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
};
</script>
