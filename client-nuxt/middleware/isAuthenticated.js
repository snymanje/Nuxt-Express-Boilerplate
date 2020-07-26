export default function ({ app, store, redirect, route, next }) {
  if (
    !route.path.includes('/resetPassword') &&
    !route.path.includes('/activateAccount') &&
    route.path !== '/forgotPassword'
  ) {
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
    if (!store.state.auth.loggedIn || store.state.auth.user === null) {
      return redirect('/login');
    }
  }

  if (
    route.path === '/login' ||
    route.path === '/signup' ||
    route.path === '/forgotPassword' ||
    route.path.includes('/activateAccount') ||
    route.path.includes('/resetPassword')
  ) {
    if (store.state.auth.loggedIn && store.state.auth.user !== null) {
      return redirect('/');
    }
  }
}
