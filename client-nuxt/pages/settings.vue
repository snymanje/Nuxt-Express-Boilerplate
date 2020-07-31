<template>
  <div>
    <navbar />
    <button @click="protectedRoute">Protected Route</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Nothing yet',
    };
  },
  methods: {
    async protectedRoute() {
      try {
        const result = await this.$axios.$get('/profile/');
        this.message = result.message;
        console.log(result);
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
