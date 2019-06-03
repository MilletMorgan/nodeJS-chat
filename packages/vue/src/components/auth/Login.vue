<template>
        <div class="col-md-6">
            <div class="element">
                <h2>Login</h2>
                <br>
                <form class="login" @submit.prevent="login">
                    <label for="email">Email</label>
                    <input class="form-control" required v-model="email" type="email" placeholder="email" name="email" id="email"/>
                    <br>
                    <label for="password">Password</label>
                    <input class="form-control" required v-model="password" type="password" placeholder="Password" name="password" id="password"/>
                    <hr/>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>

                <p v-if="errors.length" class="bg-danger text-white">
                    <b>Please correct the following error(s) :</b>
                <ul class="list-group">
                    <li v-for="error in errors" :key="error" class="list-group-item bg-danger text-white">{{ error }}
                    </li>
                </ul>
                </p>
            </div>
        </div>
</template>

<script>
    export default {
        data() {
            return {
                errors: [],
                email: "",
                password: ""
            };
        },
        methods: {
            login: function() {
                this.errors = [];

                if(!this.email){
                    this.errors.push('Email required');
                }

                if(!this.password) {
                    this.errors.push('Password required');
                }

                let email = this.email;
                let password = this.password;
                this.$store
                    .dispatch("login", { email, password })
                    .then(() => this.$router.push("/resources"))
                    .catch(err => console.log(err))
            }
        }
    };
    /*
    import axios from 'axios';
    const passport = require('passport/lib');
    const LocalStrategy = require('passport-local/lib').Strategy;
    const bcrypt = require('bcrypt-nodejs');

    export default {
        name: "Signin",
        data: function () {
            return {
                errors: [],
                email: null,
                password: null,
                info: null,
                infos: null
            };
        },
        methods: {
            checkForm: function () {

                this.errors = [];

                if(!this.email){
                    this.errors.push('Email required');
                }

                if(!this.password) {
                    this.errors.push('Password required');
                }

                axios.get(`http://localhost:5000/users?email=${this.email}`)
                    .then(response => (this.infos = response.data));


                if (this.email === this.infos && this.password === info.password)
                    console.log(info);
                else
                    console.log("error");
            },
        },
    };
     */
</script>

<style scoped>

</style>
