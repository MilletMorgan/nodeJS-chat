<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App Morgan"/> -->
        <h1>Single Page Application of instant chat</h1>
        <h5>NodeJS - VueJS</h5>
        <br><br><br>
        <ul class="nav justify-content-center">
            <li class="nav-item">
                <router-link to="/">Home</router-link>
            </li>
            <li class="nav-item">
                <span v-if="isLoggedIn"> | You are successfully connected -  <a @click="logout">Logout</a></span>

                <span v-else>
                    | <router-link to="/login">Login</router-link>
                    | <router-link to="/register">Register</router-link>
                </span>
            </li>
        </ul>

        <hr>

        <h3>Welcome to the application, please login or register for start</h3>


        <!-- <router-view/> -->

        <div class="container">
            <div class="row auth">

                <Signin/>
                <Signup/>

            </div>
        </div>

    </div>
</template>

<script>
    //import HelloWorld from './components/HelloWorld.vue'
    import Signup from './components/auth/Register.vue';
    import Signin from './components/auth/Login.vue';

    export default {
        computed: {
            isLoggedIn: function() {
                return this.$store.getters.isLoggedIn;
            }
        },
        methods: {
            logout: function() {
                this.$store.dispatch("logout").then(() => {
                    this.$router.push("/login");
                });
            }
        },
        components: {
            //HelloWorld,
            Signup,
            Signin
        },
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
