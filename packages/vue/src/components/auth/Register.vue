<template>
        <div class="col-md-6 signup">
            <div class="element">
                <span class="bg-success">
                    {{ success }}
                </span>
                <span class="bg-warning">
                    {{ error }}
                </span>
                <h2>Register</h2>
                <hr>
                <form @submit.prevent="register">
                    <label for="name">Name</label>
                    <div>
                        <input class="form-control" id="name" type="text" v-model="name" required autofocus placeholder="name">
                    </div>
                    <br>
                    <label for="email" >Email</label>
                    <div>
                        <input class="form-control" id="email" type="email" v-model="email" required placeholder="email">
                    </div>
                    <br>
                    <label for="password">Password</label>
                    <div>
                        <input class="form-control" id="password" type="password" v-model="password" required placeholder="password">
                    </div>
                    <br>
                    <label for="password-confirm">Confirm Password</label>
                    <div>
                        <input class="form-control" id="password-confirm" type="password" v-model="password_confirmation" required placeholder="password">
                    </div>
                    <hr>
                    <div>
                        <button type="submit" class="btn btn-light">Register</button>
                    </div>
                </form>
            </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        data() {
            return {
                name: null,
                email: null,
                password: null,
                password_confirmation: null,
                socket: null,
                success: null,
                error: null
            };
        },
        methods: {
            register() {
                this.socket = io('/', {path: '/api/socket'});

                if (this.password === this.password_confirmation) {
                    this.socket.emit('REGISTER', {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    });

                    this.success = 'Vous êtes inscrit avec succès !';
                } else {
                    this.error = 'Les mots de passes ne correspondent pas !';
                }
            }
        }
    }
    /*
    import axios from 'axios';

    export default {
        name: "Signup",
        data: function () {
            return {
                errors: [],
                email: null,
                password: null,
                repeatPassword: null
            };
        },
        methods: {
            checkForm: function () {
                this.errors = [];

                if (!this.email) {
                    this.errors.push('Email required');
                }

                if (!this.password) {
                    this.errors.push('Password required');
                }

                if (!this.repeatPassword) {
                    this.errors.push('Password repeat required');
                }

                if (this.password !== this.repeatPassword) {
                    this.errors.push('The passwords do not match.');
                }
                if (this.errors.length) {
                    return false;
                }

                axios.post(`http://localhost:5000/users`, {
                    email: this.email,
                    password: this.password
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
    };

     */
</script>

<style scoped>

</style>
