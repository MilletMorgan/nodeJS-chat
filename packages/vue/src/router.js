import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Home from './views/Home.vue'
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Chat from './views/Chat.vue'
import Profile from './views/profile.vue'

Vue.use(Router);

let router = new Router ({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat,
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

export default router
