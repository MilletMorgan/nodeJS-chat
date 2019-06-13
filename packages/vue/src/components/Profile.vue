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
                    <th scope="row">{{ user_id }}</th>
                    <td>{{ user_name }}</td>
                    <td>{{ user_email }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import io from 'socket.io-client';
    import axios from 'axios';

    export default {
        data() {
          return {
              user: null,
              users: [],
              socket: null,
              user_email: null,
              user_name: null,
              user_id: null
          }
        },
        methods: {
            isLoggedIn() {
                axios.get('/api/login').then(response => {
                    console.log(response);
                    this.user_id = response.data.id;
                    this.user_email = response.data.email;
                    this.user_name = response.data.name;
                }).catch(error => console.log(error));
            },
        },
        mounted: function () {
            this.socket = io('/', { path: '/api/socket' });

            this.socket.on('USERS', (data) => {
                this.users = data;
                console.log(this.users.length);
            });
        },
        beforeMount() {
            this.isLoggedIn();
        },
        computed: mapState ([
            'users'
        ])
    }
</script>
