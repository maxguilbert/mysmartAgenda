import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTextareaAutosize from "vue-textarea-autosize";

import firebase from "firebase/compat/app";

import "firebase/compat/firestore";

Vue.use(VueTextareaAutosize);

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: "AIzaSyBB5tvU5j77_uA5x9REh-Goe-eUcbugxIE",
  authDomain: "vue-calendar-9d9d3.firebaseapp.com",
  projectId: "vue-calendar-9d9d3",
  storageBucket: "vue-calendar-9d9d3.appspot.com",
  messagingSenderId: "137459455355",
  appId: "1:137459455355:web:0c7f29d8c3e52e211919de",
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
