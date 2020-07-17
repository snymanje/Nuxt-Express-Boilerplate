<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  async mounted() {
    console.log('This is logged by FETCH !!!!!!!!!');
    const loggedIn = await this.$gAuth.isAuthorized;
    const authData = await this.$gAuth;
    console.log(`isAuthorized ${loggedIn}`);
    console.log(authData);
  },
};
</script>
