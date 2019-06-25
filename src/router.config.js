/**
 * Created by liunannan on 2017/10/30.
 */
import List from './components/list/list.vue';
import Help from './components/help/help.vue';
import My from './components/my/my.vue';
import Login from './components/reglogin/login.vue';
import Register from './components/reglogin/register.vue';

export default {
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    routes: [
        {path: '/list', meta: {requireAuth: true}, component: List},
        {path: '/help', meta: {requireAuth: true}, component: Help},
        {path: '/my', meta: {requireAuth: true}, component: My},
        {path: '/login', component: Login},
        {path: '/register', component: Register},
        {path: '*', redirect: '/list'}
    ]
};
