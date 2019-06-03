<template>
        <div class="col-md-6 signup">
            <div class="element">
                <h2>Register</h2>
                <br>
                <form @submit.prevent="register">
                    <label for="name">Name</label>
                    <div>
                        <input class="form-control" id="name" type="text" v-model="name" required autofocus>
                    </div>
                    <br>
                    <label for="email" >E-Mail Address</label>
                    <div>
                        <input class="form-control" id="email" type="email" v-model="email" required>
                    </div>
                    <br>
                    <label for="password">Password</label>
                    <div>
                        <input class="form-control" id="password" type="password" v-model="password" required>
                    </div>
                    <br>
                    <label for="password-confirm">Confirm Password</label>
                    <div>
                        <input class="form-control" id="password-confirm" type="password" v-model="password_confirmation" required>
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
    export default {
        data() {
            return {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            };
        },
        methods: {
            register: function() {
                let data = {
                    name: this.name,
                    email: this.email,
                    password: this.password
                };
                this.$store
                    .dispatch("register", data)
                    .then(() => this.$router.push("/"))
                    .catch(err => console.log(err));
            }
        }
    };
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
