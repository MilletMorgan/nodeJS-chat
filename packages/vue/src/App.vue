<template>
    <div id="app">
        <nav class="navbar fixed-top navbar-light bg-primary justify-content-center text-light">
            <router-link to="/" class="navbar-brand text-light">
                <img alt="Vue logo" src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top">
                SPA of instant chat | NodeJS - VueJS
            </router-link>
            <ul class="nav">
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/">Accueil</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/profile"><span v-if="user_name">{{`${user_name} |`}} </span>Profile</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="btn btn-outline-success" to="/admin">Admin</router-link>
                </li>
                <li class="nav-item">
                    <a href="/api/logout" type="button" class="btn btn-outline-warning">DISCONNECT</a>

                    <button type="button" class="btn btn-outline-warning" @click="logout">Déconnexion</button>

                </li>
            </ul>
        </nav>

        <router-view/>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import axios from 'axios';

    export default {
        data() {
            return {
                socket: null,
                user_name: null,
                user_email: null,
                user_id: null,
                connected: false
            };
        },
        methods: {
            isLoggedIn() {
                axios.get('/api/login').then(response => {
                    console.log(response);
                    this.user_id = response.data.id;
                    this.user_email = response.data.email;
                    this.user_name = response.data.name;
                    this.connected = true;
                    console.log("User " + this.user_name + " connected");
                }).catch(error => console.log(error));
            },
            logout() {
                this.socket = io('/', {path: '/api/socket'});
                console.log("User " + this.user_name + " logout");
                this.socket.on('disconnect');
                this.socket.emit('logout', this.user_name);

            },
            profile: function () {
                this.$router.push(("/profile"));
            }
        },
        beforeMount() {
            this.isLoggedIn();
        }
    };
</script>

<style>

</style>
