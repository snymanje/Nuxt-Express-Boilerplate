<template>
  <div>
    <navbar />
    <p class="mt-8">{{ user }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: 'Nothing yet',
    };
  },
  async created() {
    try {
      const user = await this.$axios.$get('/user/getCurrentUser');
      this.user = user.user;
    } catch (error) {
      // console.log(error);
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
