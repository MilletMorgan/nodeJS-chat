<template>
    <div>
        <div v-if="isLoggedIn">
            <h1>Welcome</h1>
        </div>
        <div v-else>
            <h1>Welcome to the application, please login or register for start</h1>

            <div class="container">
                <div class="row card">
                    <Signin/>
                    <Signup/>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Signup from '@/components/auth/Register.vue';
    import Signin from '@/components/auth/Login.vue';

    export default {
        computed: {
            isLoggedIn: function() {
                return this.$store.getters.isLoggedIn;
            }
        },
        components: {
            Signup,
            Signin
        }
    }
</script>
