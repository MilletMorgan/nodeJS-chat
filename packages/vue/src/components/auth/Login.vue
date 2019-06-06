<template>
        <div class="col-md-6">
            <div class="element">
                <h2>Connexion</h2>
                <hr>
                <form class="login" @submit.prevent="login">
                    <label for="email">Email</label>
                    <input class="form-control" required v-model="email" type="email" placeholder="email" name="email" id="email"/>
                    <br>
                    <label for="password">Mot de passe</label>
                    <input class="form-control" required v-model="password" type="password" placeholder="mot de passe" name="password" id="password"/>
                    <hr/>
                    <button type="submit" class="btn btn-outline-success">Connexion</button>
                </form>

                <br>

                <div class="alert alert-success" v-if="userData.length">
                    <p>Vous êtes connecter avec succès !</p>
                    <ul v-for="(data, index) in userData" :key="index" class="list-group bg-success">
                        <li class="list-group-item bg-success">{{ `Email : ${data.email}` }}</li>
                        <li class="list-group-item bg-success">{{ `Nom : ${data.name}` }}</li>
                        <li class="list-group-item bg-success">{{ `Mot de passe : ${data.password}` }}</li>
                    </ul>
                </div>
            </div>
        </div>
</template>

<script>
    import io from 'socket.io-client';

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
            };
        },
        methods: {
            login() {
                this.socket = io('/', {path: '/api/socket'});

                this.socket.on('USERS', (data) => {
                    this.user = data;
                    this.user.forEach(k => {
                        if (this.email === k.email) {
                            this.email = k.email;
                            this.userData.push({
                                email: k.email,
                                name: k.name,
                                password: k.password
                            });
                        }
                    });
                });
            }
        }
    };
</script>

<style scoped>

</style>
