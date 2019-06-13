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

            <div class="alert alert-danger" v-if="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                error: null,
                email: null,
                password: null,
            };
        },
        methods: {
            async login() {
                const { data: { name, email } } = (await axios.post('/api/login', {
                    email: this.email,
                    password: this.password
                }));

                this.$emit('logged', { name, email });
            }
        }
    };
</script>

<style scoped>

</style>
