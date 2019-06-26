<template>
    <div class="col-md-6 signup bg-primary">
        <div class="element">
            <h2 class="wow animated fadeIn">Inscription</h2>
            <hr class="wow animated fadeIn">
            <form @submit.prevent="register">
                <label for="name" class="wow animated fadeIn">Nom complet</label>
                <input
                        class="form-control wow animated fadeIn"
                        id="name"
                        type="text"
                        v-model="name"
                        required
                        autofocus
                        placeholder="nom"
                        autocomplete="name"
                >
                <br>
                <label for="email" class="wow animated fadeIn">Email</label>
                <input
                        class="form-control wow animated fadeIn"
                        id="email"
                        type="email"
                        v-model="email"
                        required
                        placeholder="email"
                        autocomplete="email"
                >
                <br>
                <label for="password" class="wow animated fadeIn">Mot de passe</label>
                <input
                        class="form-control wow animated fadeIn"
                        id="password"
                        type="password"
                        v-model="password"
                        required
                        placeholder="mot de passe"
                        autocomplete="password"
                >
                <br>
                <label for="password-confirm" class="wow animated fadeIn">
                    Confirmer votre mot de passe
                </label>
                <input
                        class="form-control wow animated fadeIn"
                        id="password-confirm"
                        type="password"
                        v-model="password_confirmation"
                        required placeholder="mot de passe"
                        autocomplete="new-password"
                >
                <hr class="wow animated fadeIn">
                <button
                        type="submit"
                        class="btn btn-outline-success wow animated fadeInUp"
                >
                    Inscription
                </button>
            </form>

            <br>

            <div class="alert alert-success wow animated fadeInDown" v-if="success">
                {{ success }}
            </div>
            <div class="alert alert-warning wow animated fadeInDown" v-if="error">
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
                name: null,
                email: null,
                password: null,
                password_confirmation: null,
                socket: null,
                success: null,
                error: null,
                user_email: null,
                user_name: null
            };
        },
        methods: {
            register() {

                if (this.password === this.password_confirmation) {
                    axios.post('/api/register', {
                        id: null,
                        name: this.name,
                        email: this.email,
                        password: this.password
                    }).then(response => {
                        console.log(response);
                        this.success = 'Vous êtes inscrit avec succès !';
                    }).catch(error => console.log(error));
                } else this.error = 'Les mots de passes ne correspondent pas !';
            }
        }
    };
</script>

<style scoped>

</style>
