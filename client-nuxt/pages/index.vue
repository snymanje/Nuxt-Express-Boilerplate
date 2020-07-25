<template>
  <div>
    <navbar />
    <main>
      <div class="pt-8 px-4 text-gray-900">
        <h1 class="font-medium text-3xl">Welcome, {{ getUser }}</h1>
        <p class="my-6">
          This boilerplate is primaraly focused on being a template with
          authentication ready to go. <br />Authentication is the part of an
          application that can take a lot of time to get right and no one wants
          to reimplement authentication and autherization from scratch with
          every new project.
        </p>
        <p class="font-medium text-xl mt-4">
          What is included in this boilerplate?
        </p>
        <ul>
          <li>> Express Backend</li>
          <li>> Nuxtjs Frontend</li>
          <li>> Login with google</li>
          <li>> Login with username and password</li>
          <li>> Storing JWT in cookies</li>
          <li>
            > Refresh tokens with automatic token refresh via axios interceptors
          </li>
          <li>> Forgot\Reset Password</li>
          <li>> Update Password</li>
          <li>> Route guards</li>
        </ul>
        <p class="font-medium text-xl mt-4">
          What must still be included??
        </p>
        <ul>
          <li>> Unit Tests</li>
          <li>> Login with Github</li>
          <li>> Login with Facebook</li>
          <li>> Login with Apple</li>
          <li>> Login with Microsoft</li>
          <li>> Better UI</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    getUser() {
      return this.auth().user.user.method === 'local'
        ? this.auth().user.user.local.name
        : this.auth().user.user.google.name;
    },
  },
  methods: {
    ...mapGetters(['auth']),
  },
};
</script>

<style lang="scss" scoped></style>
