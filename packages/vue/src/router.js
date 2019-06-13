import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Hello from './components/Hello.vue'
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Chat from './components/Chat.vue'
import Profile from './components/Profile.vue'
import Admin from './components/Admin.vue'

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
          path: '/admin',
          name: 'admin',
          component: Admin
        },
        {
          path: '/test',
          name: 'test',
          component: Hello
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
