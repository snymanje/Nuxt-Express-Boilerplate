export default function ({ app, store, redirect, route, next }) {
  if (
    !route.path.includes('/resetPassword') &&
    !route.path.includes('/activateAccount') &&
    route.path !== '/forgotPassword'
  ) {
    console.log('We are here, step 1');
    console.log(route.path);
    if (!app.$cookies.get('refreshTokenPayload')) {
      store.dispatch('loggedOut');
    }
  }

  if (
    route.path !== '/login' &&
    route.path !== '/signup' &&
    !route.path.includes('/resetPassword') &&
    !route.path.includes('/activateAccount') &&
    route.path !== '/forgotPassword'
  ) {
    console.log('We are here, step 2');
    if (!store.state.auth.loggedIn || store.state.auth.user === null) {
      return redirect('/login');
    }
  }

  if (route.path === '/login' || route.path === '/signup') {
    console.log('We are here, step 3');
    if (store.state.auth.loggedIn && store.state.auth.user !== null) {
      return redirect('/');
    }
  }
}
