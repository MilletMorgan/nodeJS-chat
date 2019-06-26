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
                <tr v-for="({ id, name, email }, index) in allUsers.data" :key="index">
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
    import Axios from 'axios';

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
            supprimer(index) {
                index.session = true;
                const v = selectedUsers();
                console.log();
            }
        },
        computed: {
            selectedUsers() {
                return this.users.filter(index => index.selected);
            }
        },
        mounted: function () {
            Axios.get('/api/admin').then(response => this.allUsers = response).catch(error => console.log(error));
        }
    };
</script>
