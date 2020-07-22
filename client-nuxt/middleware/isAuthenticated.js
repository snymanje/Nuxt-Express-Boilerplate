export default function ({ app, store, redirect, route, next }) {
  if (!app.$cookies.get('refreshTokenPayload')) {
    store.dispatch('loggedOut');
  }

  if (
    route.path !== '/login' &&
    route.path !== '/signup' &&
    !route.path.includes('/resetPassword') &&
    route.path !== '/forgotPassword'
  ) {
    if (!store.state.auth.loggedIn || store.state.auth.user === null) {
      return redirect('/login');
    }
  }

  if (route.path === '/login' || route.path === '/signup') {
    if (store.state.auth.loggedIn && store.state.auth.user !== null) {
      return redirect('/');
    }
  }
}
