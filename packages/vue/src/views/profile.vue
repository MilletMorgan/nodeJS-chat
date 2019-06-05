<template>
    <div class="card container padding">
        <h1>Profile</h1>
        <br>
        <ul class="list-group">
            <li v-for="({ author }, index) in users" :key="index" class="list-group-item">
                {{ 'Nom : ' + author }}
            </li>
        </ul>
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

            this.socket.on('USERS', (data) => {
                this.users = data;
            });
        },
        computed: mapState ([
            'users'
        ])
    }
</script>
