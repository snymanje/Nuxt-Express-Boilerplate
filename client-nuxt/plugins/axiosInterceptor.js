export default function ({ $axios, redirect, store }) {
  let isAlreadyFetchingAccessToken = false;
  $axios.onError(async (error) => {
    const { config, response } = error;
    const originalRequest = config;
    if (
      !config.url.includes('/login') &&
      !config.url.includes('/tokenRefresh')
    ) {
      if (response.status === 401 && response.data.message === 'jwt expired') {
        console.log('Fetching refresh token now...');
        if (!isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true;
          try {
            await $axios.$post('/auth/tokenRefresh');
            isAlreadyFetchingAccessToken = false;
            return $axios(originalRequest);
          } catch (err) {
            await store.dispatch('loggedOut');
            isAlreadyFetchingAccessToken = false;
            redirect('/login');
          }
        } else {
          await store.dispatch('loggedOut');
          await redirect('/login');
        }
      }
    }
    return Promise.reject(error);
  });
}
