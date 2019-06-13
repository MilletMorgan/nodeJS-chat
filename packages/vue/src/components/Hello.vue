<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <form method="post" @submit.prevent="submit">
            <label for="message">message</label>
            <input type="text" id="message" v-model="message">
            <button type="submit">envoyé</button>
        </form>

        <table class="table table-striped">
            <tbody>
            <tr v-for="({ item }, index) in content" :key="index">
                <td>{{ itemt }}</td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        name: 'hello',
        data () {
            return {
                msg: 'HELLO WORLD!',
                message: null,
                content: []
            }
        },
        methods: {
            submit(e) {
                this.socket = io('/', {path: '/api/socket'});

                e.preventDefault();
                this.socket.emit('chat message', this.message);

                this.socket.on('chat message', (msg) => {
                    this.content = msg
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
