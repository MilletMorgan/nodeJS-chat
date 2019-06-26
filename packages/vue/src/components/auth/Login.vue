<template>
    <div class="col-md-6">
        <div class="element">
            <h2 class=" wow animated fadeIn">Connexion</h2>
            <hr class="wow animated fadeIn">
            <form class="login" @submit.prevent="login">
                <label for="login-email" class=" wow animated fadeIn">Email</label>
                <input
                        class="form-control wow animated fadeIn"
                        required
                        v-model="email"
                        type="email"
                        placeholder="email"
                        name="email"
                        id="login-email"
                        autocomplete="email"
                />
                <br>
                <label for="login-password" class=" wow animated fadeIn">Mot de passe</label>
                <input
                        class="form-control wow animated fadeIn"
                        required
                        v-model="password"
                        type="password"
                        placeholder="mot de passe"
                        name="password"
                        id="login-password"
                        autocomplete="password"
                />
                <hr class="wow animated fadeIn"/>
                <button type="submit" class="btn btn-outline-success button-login wow animated fadeInUp">
                    Connexion
                </button>
            </form>

            <br>

            <div class="alert alert-danger wow animated fadeIn" v-if="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: null,
                email: null,
                password: null,
            };
        },
        methods: {
            login() {
                this.$store.dispatch('logUser', { email: this.email, password: this.password })
                    .catch(err => this.error = err);
            }
        }
    };
</script>

<style scoped>

</style>
