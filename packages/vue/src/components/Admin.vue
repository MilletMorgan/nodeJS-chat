<template>
    <div class="card container">
        <div class="card-body">
            <h2 class="card-title wow animated fadeIn">Admin</h2>
            <table class="table table-striped wow animated fadeIn">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                    <th scope="col">SUPPRIMER</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="({ id, name, email }, index) in allUsers.data"
                    :key="index"
                    :class="{selected: index.selected}"
                    @click="deleteUser(index)"
                >
                    <th scope="row"><span ref="{id}}">{{ id }}</span></th>
                    <td>{{ name }}</td>
                    <td>{{ email }}</td>
                    <td>
                        <button type="button" class="btn btn-danger">SUPPRIMER</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';
    import io from 'socket.io-client';

    export default {
        data() {
            return {
                user: null,
                users: [],
                socket: null,
                id: null,
                allUsers: []
            };
        },
        methods: {
            deleteUser(index) {
                console.log("delete : ", this.allUsers.data[index]);
                Axios.post('/api/deleteUser', this.allUsers.data[index]).then(response => {
                    console.log(response);
                    this.allUsers.data.splice(index, 1);
                }).catch(error => console.log(error));

                this.socket = io('/', { path: '/api/socket' });
            },
            getUsers() {
                this.socket.on('USERS', (users) => this.allUsers = users)
            }
        },
        computed: {
        },
        mounted: function () {
            Axios.get('/api/admin').then(response => this.allUsers = response).catch(error => console.log(error));
        },
        beforeMount() {
            this.getUsers();
        }
    };
</script>
