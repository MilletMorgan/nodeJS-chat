<template>
    <div id="app">
        <nav class="navbar navbar-light bg-white justify-content-center">
            <router-link to="/" class="navbar-brand">
                <img alt="Vue logo" src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top">
                SPA of instant chat | NodeJS - VueJS
            </router-link>
            <ul class="nav" v-if="user">
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/">Accueil</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/profile">
                        {{ user.name}} | Profile
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/admin">Admin</router-link>
                </li>
                <li class="nav-item">
                    <a href="/api/logout" class="btn btn-outline-warning">Log out</a>
                </li>
            </ul>
        </nav>

        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {},
        computed: {
            user() {
                return this.$store.state.user;
            }
        },

        beforeMount() {
            this.$store.dispatch('retrieveUser');
        }
    };
</script>

<style>

</style>
