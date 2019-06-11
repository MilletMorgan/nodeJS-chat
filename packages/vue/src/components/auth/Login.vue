<template>
        <div class="col-md-6">
            <div class="element">
                <h2>Connexion</h2>
                <hr>
                <form class="login" @submit.prevent="login">
                    <label for="login-email">Email</label>
                    <input
                            class="form-control"
                            required
                            v-model="email"
                            type="email"
                            placeholder="email"
                            name="email"
                            id="login-email"
                            autocomplete="email"
                    />
                    <br>
                    <label for="login-password">Mot de passe</label>
                    <input
                            class="form-control"
                            required
                            v-model="password"
                            type="password"
                            placeholder="mot de passe"
                            name="password"
                            id="login-password"
                            autocomplete="password"
                    />
                    <hr/>
                    <button
                            type="submit"
                            class="btn btn-outline-success">
                        Connexion
                    </button>
                </form>

                <br>

                <div class="alert alert-success" v-if="success">
                    {{ success }}
                    <br><br>
                    {{ `Email : ${user_email}` }}
                    <br>
                    {{ `Name : ${user_name}` }}
                </div>

                <div class="alert alert-danger" v-if="error">
                    {{ error }}
                </div>

                <!--

                <div
                        class="alert alert-success"
                        v-if="userData.length"
                >
                    <p>Vous êtes connecter avec succès !</p>
                    <ul
                            v-for="(data, index) in userData"
                            :key="index"
                            class="list-group bg-success"
                    >
                        <li class="list-group-item bg-success">
                            {{ `Email : ${data.email}` }}
                        </li>
                        <li class="list-group-item bg-success">
                            {{ `Nom : ${data.name}` }}
                        </li>
                        <li class="list-group-item bg-success">
                            {{ `Mot de passe : ${data.password}` }}
                        </li>
                    </ul>
                </div>
                -->
            </div>
        </div>
</template>

<script>
    //import io from 'socket.io-client';
    import axios from 'axios';

    export default {
        data() {
            return {
                error: null,
                user: [],
                userData: [],
                name: null,
                email: null,
                password: null,
                socket: null,
                user_email: null,
                user_name: null,
                success: null
            };
        },
        methods: {
            login() {
                axios.post('/api/login', {
                    email: this.email,
                    password: this.password
                }).then(response => {
                    console.log(response);
                    this.success = 'Vous êtes connecter avec succès !';
                    this.user_email = response.data.email;
                    this.user_name = response.data.name;
                }).catch(error => {
                    console.log(error);
                });
            }


        }
    };
</script>

<style scoped>

</style>
