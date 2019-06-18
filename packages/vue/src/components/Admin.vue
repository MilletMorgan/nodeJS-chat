<template>
    <div class="card container">
        <div class="card-body">
            <h2 class="card-title">Admin</h2>
            <table class="table table-striped">
                <thead class="bg-primary text-light">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                    <th scope="col">SUPPRIMER</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="({ id, name, email }, index) in users" :key="index" :class="{selected: index.selected}"
                    @click="select(index)">
                    <th scope="row"><span ref="{id}}">{{ id }}</span></th>
                    <td>{{ name }}</td>
                    <td>{{ email }}</td>
                    <td>
                        <button @click="supprimer" type="button" class="btn btn-danger">SUPPRIMER</button>
                    </td>
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
                user: null,
                users: [],
                socket: null,
                id: null
            };
        },
        methods: {},
        computed: {},
        mounted: function () {
            this.socket = io('/', { path: '/api/socket' });

            this.socket.on('ALLUSERS', (data) => this.users = data);
        }
    };
</script>
