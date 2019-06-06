<template>
    <div class="card container">
        <div class="card-body">
            <h5 class="card-title">Profile</h5>
            <div class="messages" id="target-message" v-for="({ name, email, password }, index) in users" :key="index">
                {{ name }}
                {{ email }}
                {{ password }}
            </div>
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

            this.socket.on('USERS', (data) => {
                this.users = data;
                console.log(this.users.length);
            });
        },
        computed: mapState ([
            'users'
        ])
    }
</script>
