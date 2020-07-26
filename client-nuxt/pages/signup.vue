<template>
  <div
    class="flex flex-wrap h-screen"
    style="font-family: 'Open Sans', sans-serif;"
  >
    <div class="w-1/2">
      <div class="flex items-center justify-center">
        <img
          src="~/assets/images/signup_ml.jpg"
          alt="signup image"
          class="object-cover h-screen object-center"
        />
      </div>
    </div>
    <div class="w-1/2">
      <div class="flex items-center justify-center h-full">
        <div class="w-full max-w-md">
          <h1 class="font-bold text-4xl text-center text-black mb-6">
            Sign up for an account
          </h1>
          <p class="text-gray-800 text-md">Sign up with</p>
          <div class="flex justify-between mt-1">
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Facebook
            </button>
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
              @click="googleSignup"
            >
              Google
            </button>
            <button
              class="w-1/3 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Github
            </button>
          </div>
          <div class="flex items-center justify-between my-6">
            <div class="flex-1 border border-solid border-gray-400"></div>
            <div class="flex-0 px-2 font-semibold">
              Or continue with
            </div>
            <div class="flex-1 border border-solid border-gray-400"></div>
          </div>
          <form class="bg-white rounded pt-6 pb-8 mb-4">
            <div class="mb-3">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
                >Name</label
              >
              <input
                id="name"
                v-model="name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div class="mb-3">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
                >Email address</label
              >
              <input
                id="email"
                v-model="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div class="mb-3">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
                >Password</label
              >
              <input
                id="password"
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
              />
              <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
            </div>
            <div class="mb-3">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="passwordConfirm"
                >Confirm Password</label
              >
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
              />
              <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
            </div>
            <div class="flex flex-col items-center">
              <button
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                @click="signup"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p class="text-center text-gray-500 text-md">
            Already have an account?
            <nuxt-link
              to="/login"
              class="text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
              >Sign In</nuxt-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
  },
  methods: {
    async signup() {
      try {
        const results = await this.$axios.$post('/auth/signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
        });
        console.log(results);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async googleSignup() {
      try {
        const { wc } = await this.$gAuth.signIn();
        const results = await this.$axios.$post('/auth/googleSignup', {
          access_token: wc.id_token,
        });
        console.log(results);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
};
</script>
