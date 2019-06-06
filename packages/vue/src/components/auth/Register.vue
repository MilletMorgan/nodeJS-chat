<template>
        <div class="col-md-6 signup bg-primary">
            <div class="element">
                <h2>Inscription</h2>
                <hr>
                <form @submit.prevent="register">
                    <label for="name">Nom</label>
                    <div>
                        <input class="form-control" id="name" type="text" v-model="name" required autofocus placeholder="nom">
                    </div>
                    <br>
                    <label for="email" >Email</label>
                    <div>
                        <input class="form-control" id="email" type="email" v-model="email" required placeholder="email">
                    </div>
                    <br>
                    <label for="password">Mot de passe</label>
                    <div>
                        <input class="form-control" id="password" type="password" v-model="password" required placeholder="mot de passe">
                    </div>
                    <br>
                    <label for="password-confirm">Confirmer votre mot de passe</label>
                    <div>
                        <input class="form-control" id="password-confirm" type="password" v-model="password_confirmation" required placeholder="mot de passe">
                    </div>
                    <hr>
                    <div>
                        <button type="submit" class="btn btn-outline-success">Inscription</button>
                    </div>
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
</script>

<style scoped>

</style>
