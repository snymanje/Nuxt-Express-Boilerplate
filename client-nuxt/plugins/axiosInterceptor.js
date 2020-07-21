export default function ({ $axios, redirect, store }) {
  let isAlreadyFetchingAccessToken = false;
  $axios.onError(async (error) => {
    const { config, response } = error;
    const originalRequest = config;
    if (
      !config.url.includes('/login') &&
      !config.url.includes(
        '/tokenRefresh',
      ) /* &&
      !config.url.includes('/resetPassword') &&
      !config.url.includes('/forgotPwd') */
    ) {
      if (response.status === 401 && response.data.message === 'jwt expired') {
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true;
          try {
            await $axios.$post('/auth/tokenRefresh');
            return $axios(originalRequest);
          } catch (err) {
            console.log(err.response);
            await store.dispatch('loggedOut');
            redirect('/login');
          }
        } else {
          await store.dispatch('loggedOut');
          await redirect('/login');
        }
        isAlreadyFetchingAccessToken = false;
      }
    }
    return Promise.reject(error);
  });
}
