<template>
    <div>
        <div v-if="!user">
            <div class="container">
                <div class="row card">
                    <Login/>
                    <Signup/>
                </div>
            </div>
        </div>
        <Chat v-else/>
    </div>
</template>

<script>
    import Signup from '@/components/auth/Register.vue';
    import Login from '@/components/auth/Login.vue';
    import Chat from '@/components/Chat';

    export default {
    data() {
        return {
        };
    },
    methods: {
    },

    computed: {
        user() {
            return this.$store.state.user
        }
    },
    components: {
        Signup,
        Login,
        Chat
    }
}
</script>
