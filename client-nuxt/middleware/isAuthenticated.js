export default function ({ app, store, redirect, route, next }) {
  if (!app.$cookies.get('refreshTokenPayload')) {
    store.dispatch('loggedOut');
  }

  if (
    route.path !== '/login' &&
    route.path !== '/signup' &&
    route.path !== '/resetPassword' &&
    route.path !== '/forgotPwd'
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
