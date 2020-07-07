<template>
  <div
    class="flex flex-wrap h-screen"
    style="font-family: 'Open Sans', sans-serif;"
  >
    <div class="w-1/2">
      <div class="flex items-center justify-center h-full">
        <div class="w-full max-w-md">
          <h1 class="font-bold text-4xl text-center text-black mb-6">
            Sign in to you account
          </h1>
          <p class="text-gray-800 text-md">Sign in with</p>
          <div class="flex justify-between mt-1">
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Facebook
            </button>
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Google
            </button>
            <button
              class="w-1/3 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Github
            </button>
          </div>
          <div class="flex items-center justify-between my-8">
            <div class="flex-1 border border-solid border-gray-400"></div>
            <div class="flex-1 px-2 font-semibold">Or continue with</div>
            <div class="flex-1 border border-solid border-gray-400"></div>
          </div>
          <form class="bg-white rounded pt-6 pb-8 mb-4">
            <div class="mb-4">
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
            <div class="mb-6">
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
            <div class="flex flex-col items-center">
              <button
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                @click="login"
              >
                Sign In
              </button>
              <a
                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4"
                href="#"
                >Forgot Password?</a
              >
            </div>
          </form>
          <p class="text-center text-gray-500 text-md">
            Don't have an account?
            <nuxt-link
              to="/signup"
              class="text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
              >Sign Up</nuxt-link
            >
          </p>
        </div>
      </div>
    </div>
    <div class="w-1/2">
      <div class="flex items-center justify-center">
        <img
          src="~/assets/images/signup_ml.jpg"
          alt="signup image"
          class="object-cover h-screen object-center"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const results = await this.$axios.$post('/auth/login', {
          email: this.email,
          password: this.password,
        })
        this.$router.push('/')
      } catch (error) {
        console.log(error.response.data.message)
      }
    },
  },
}
</script>
