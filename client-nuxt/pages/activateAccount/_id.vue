<template>
  <div>
    <!-- <navbar /> -->
    <div class="flex items-center justify-center">
      <h1>{{ message }}</h1>
      <nuxt-link
        to="/login"
        class="mr-5 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
        >Continue to Login</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    };
  },
  async created() {
    const token = this.$route.params.id;
    try {
      const result = await this.$axios.$post(`/auth/activate/${token}`);
      console.log(result);
      if (result.status === true) {
        this.message = 'Account activated successfully!';
      }
    } catch (error) {
      this.message = error.response.data.message;
      console.log(error.response.data.message);
    }
  },
  methods: {},
};
</script>
