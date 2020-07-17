export default function ({ store, redirect, route, next }) {
  if (route.path !== '/login' && route.path !== '/signup') {
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
