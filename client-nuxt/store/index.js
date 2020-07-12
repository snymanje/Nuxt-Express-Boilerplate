export const state = () => ({
  auth: {
    loggedIn: false,
    redirect: {
      home: '/',
      login: '/login',
    },
    user: undefined,
  },
});

export const getters = {
  auth: (state) => state.auth,
};

export const mutations = {
  loggedIn(state, user) {
    state.auth.loggedIn = true;
    state.auth.user = user;
  },
  loggedOut(state) {
    state.auth.loggedIn = false;
    state.auth.user = null;
  },
};

export const actions = {
  loggedIn(context, user) {
    context.commit('loggedIn', user);
  },
  loggedOut(context) {
    context.commit('loggedOut');
  },
};
