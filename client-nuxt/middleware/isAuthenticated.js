export default function ({ store, redirect, route }) {
  if (route.path !== '/login' && route.path !== '/signup') {
    if (!store.state.auth.loggedIn) {
      return redirect('/login');
    }
  }
}
