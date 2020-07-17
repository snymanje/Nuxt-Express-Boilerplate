import Vue from 'vue';
import GAuth from 'vue-google-oauth2';

const gauthOption = {
  clientId:
    '594577166693-435bi5oeg3rg7duiihj02v6sgf7dll1j.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account',
};
Vue.use(GAuth, gauthOption);
