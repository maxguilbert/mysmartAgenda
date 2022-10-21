# Calendar with Vue (Vuetify and Firebase)

This is the project from the [YouTube](https://www.youtube.com/watch?v=2NOsjTT1b_k).
This project is building a calendar application. You will learn hook up a Firebase Firestore to a custom VueJS using Vuetify.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

#

#

# vuestacks-calendar-vue-firebase

### Overview

The VueStacks calendar demo utilizes general Vue.js + Firebase CRUD functions to enable creating, updating, and deleting of events in a modified Vuetify calendar component (see the following to learn more about Vuetify calendars: https://vuetifyjs.com/en/components/calendars/).

See full component in `components/Calendar.vue`

### Addition Dependencies

This demo uses `vue-textarea-autosize` as a dependency. See the following for installation instructions: https://www.npmjs.com/package/vue-textarea-autosize

### Setting Up Firebase

1. Set up a new project in Firebase with Database enabled.
2. Implement the following Firebase SDK scripts in main.js:

```
import firebase from "firebase";
firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
});

export const db = firebase.firestore();
```
