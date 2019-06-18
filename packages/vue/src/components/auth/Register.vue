<template>
    <div class="col-md-6 signup bg-primary">
        <div class="element">
            <h2>Inscription</h2>
            <hr>
            <form @submit.prevent="register">
                <label for="name">Nom complet</label>
                <input
                        class="form-control"
                        id="name"
                        type="text"
                        v-model="name"
                        required
                        autofocus
                        placeholder="nom"
                        autocomplete="name"
                >
                <br>
                <label for="email">Email</label>
                <input
                        class="form-control"
                        id="email"
                        type="email"
                        v-model="email"
                        required
                        placeholder="email"
                        autocomplete="email"
                >
                <br>
                <label for="password">Mot de passe</label>
                <input
                        class="form-control"
                        id="password"
                        type="password"
                        v-model="password"
                        required
                        placeholder="mot de passe"
                        autocomplete="password"
                >
                <br>
                <label for="password-confirm">
                    Confirmer votre mot de passe
                </label>
                <input
                        class="form-control"
                        id="password-confirm"
                        type="password"
                        v-model="password_confirmation"
                        required placeholder="mot de passe"
                        autocomplete="new-password"
                >
                <hr>
                <button
                        type="submit"
                        class="btn btn-outline-success"
                >
                    Inscription
                </button>
            </form>

            <br>

            <div class="alert alert-success" v-if="success">
                {{ success }}
            </div>
            <div class="alert alert-warning" v-if="error">
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
                    })
                        .catch(error => console.log(error));
                } else this.error = 'Les mots de passes ne correspondent pas !';
            }
        }
    };
</script>

<style scoped>

</style>
