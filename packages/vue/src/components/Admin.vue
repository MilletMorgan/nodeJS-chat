<template>
    <div class="card container">
        <div class="card-body">
            <h2 class="card-title">Admin</h2>
            <br>
            <table class="table table-striped">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mot de passe</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="({ name, email, password }, index) in users" :key="index">
                    <th scope="row">{{ id }}</th>
                    <td>{{ name }}</td>
                    <td>{{ email }}</td>
                    <td>{{ password }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import io from 'socket.io-client';

    export default {
        data() {
            return {
                user: null,
                users: [],
                socket: null
            }
        },
        mounted: function () {
            this.socket = io('/', { path: '/api/socket' });

            this.socket.on('ALLUSERS', (data) => this.users = data);
        },
        computed: mapState ([
            'users'
        ])
    }
</script>
