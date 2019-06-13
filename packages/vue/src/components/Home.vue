<template>
    <div>
        <div v-if="!user">
            <div class="container">
                <div class="row card">
                    <Login @logged="onLogged"/>
                    <Signup/>
                </div>
            </div>
        </div>
        <div v-else>
            <Chat :user="user"/>
        </div>
    </div>
</template>

<script>
    import Signup from '@/components/auth/Register.vue';
    import Login from '@/components/auth/Login.vue';
    import Chat from '@/components/Chat';

    export default {

        data() {
            return {
                user: null
            }
        },
        components: {
            Signup,
            Login,
            Chat
        },
        methods: {
            onLogged(user) {
                this.user = user;
            }
        }
    }
</script>
