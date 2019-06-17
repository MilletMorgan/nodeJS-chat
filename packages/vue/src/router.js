import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Chat from './components/Chat.vue';
import Profile from './components/Profile.vue';
import Admin from './components/Admin.vue';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            props: true
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/admin',
            name: 'admin',
            props: true,
            component: Admin
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat,
            props: true,
            meta: {
                requiresAuth: true
            }
        }
    ]
});
/*
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next();
            return
        }
        next('/')
    } else {
        next()
    }
});*/

export default router;
