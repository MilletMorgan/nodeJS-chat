<template>
    <div id="app">
        <nav class="navbar fixed-top navbar-light bg-primary justify-content-center text-light">
            <a class="navbar-brand text-light" href="#">
                <img alt="Vue logo" src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top">
                SPA of instant chat | NodeJS - VueJS
            </a>
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <router-link to="/" class="btn btn-outline-success">Accueil</router-link>
                </li>
                <li class="nav-item">
                <span v-if="isLoggedIn || true">
                    <ul class="nav">
                        <li class="nav-item">
                            <router-link class="btn btn-outline-success" to="/chat">Chat</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="btn btn-outline-success" to="/profile">Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="btn btn-outline-success" to="/admin">Admin</router-link>
                        </li>
                        <li class="nav-item">
                            <button class="btn btn-outline-warning btn-logout" @click="logout">Deconnexion</button>
                        </li>
                    </ul>
                </span>

                    <!--
                    <span v-else>
                        <router-link to="/login" class="btn btn-outline-primary">Login</router-link>
                        <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
                    </span>
                    -->
                </li>
            </ul>
        </nav>

        <router-view/>
    </div>
</template>

<script>

    export default {
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.isLoggedIn;
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch("logout").then(() => {
                    this.$router.push("/");
                });
            },
            profile: function () {
                this.$router.push(("/profile"));
            }
        }
    };
</script>

<style>

</style>
