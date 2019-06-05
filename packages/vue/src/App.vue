<template>
    <div id="app">
        <nav class="navbar fixed-top navbar-light bg-primary justify-content-center text-light">
            <a class="navbar-brand text-light" href="#">
                <img alt="Vue logo" src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top">
                SPA of instant chat | NodeJS - VueJS
            </a>
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <router-link to="/" class="btn btn-secondary">Home</router-link>
                </li>
                <li class="nav-item">
                <span v-if="isLoggedIn || true">
                    <router-link class="btn btn-secondary" to="/chat">Chat</router-link>
                    You are successfully connected -
                    <router-link class="btn btn-secondary" to="/profile">Profile</router-link>
                    <a class="btn btn-warning" @click="logout">Logout</a>
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
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
