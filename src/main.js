// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import routerConfig from './router.config.js';
import store from './store';
import {loadFromLocal} from './common/js/store';

import './common/stylus/index.styl';

Vue.use(VueResource);
Vue.use(VueRouter);
const router = new VueRouter(routerConfig);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (loadFromLocal('user')) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      });
    }
  } else if (from.path === '/list' && to.path === '/login') {
    window.history.go(1);
  } else {
    next();
  }
});
