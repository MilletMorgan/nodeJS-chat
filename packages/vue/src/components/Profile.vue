<template>
    <div class="card container">
        <div class="card-body">
            <h2 class="card-title">Profile</h2>
            <table class="table table-striped">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">{{ user.id }}</th>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        data() {
            return {
                users: [],
                socket: null,
            };
        },
        methods: {},
        mounted: function () {
            this.socket = io('/', { path: '/api/socket' });

            this.socket.on('USERS', (data) => {
                this.users = data;
            });
        },

        computed: {
            user() {
                return this.$store.state.user
            }
        },
    };
</script>
