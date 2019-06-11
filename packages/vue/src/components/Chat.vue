<template>
    <div class="card container chat">
        <div class="header bg-primary text-light">
            <h3><span>@{{ user_name }}</span></h3>
            <a href="/api/logout" v-if="socket" type="button" class="btn btn-outline-warning">Se déconnecter</a>
        </div>
        <div class="content" id="content">
            <div v-if="socket">
                <div class="data-target" id="box-scroll" v-chat-scroll>
                    <div class="messages" id="target-message" v-for="({ author, content, date, month, year, hour, minute }, index) in messages" :key="index">
                        <hr>
                            <span class="font-weight-bold">😀 {{ author }}</span>
                            <span class="message-hour">
                                <span v-if="( date !== dateToday )"> | Le </span>
                                <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                {{ `${date}/${month}/${year} - ${hour}h${minute}` }}
                            </span>
                            <br>
                            {{ content }}
                        <br>
                    </div>
                    <span v-if="currentContent">{{ `${user_name}  écrit...` }}</span>
                </div>
            </div>
            <div v-else>
                <p>Merci de vous connecter.</p>
            </div>
        </div>
        <div class="footer bg-primary text-light">

            <form @submit.prevent="sendMessage">
                <div class="row">
                    <div class="col-md-2">
                        <label for="message">Message</label>
                    </div>
                    <div class="col-md-8">
                        <input v-model="currentContent" class="form-control" id="message"/>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-outline-success">Envoyer</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import Vue from 'vue';
    import VueChatScroll from 'vue-chat-scroll';
    Vue.use(VueChatScroll);
    import axios from 'axios';

    export default {
        data() {
            return {
                messages: [],
                users: [],
                user: null,
                currentContent: null,
                author: null,
                dateToday: null,
                date: null,
                month: null,
                year: null,
                hour: null,
                minute: null,
                socket: null,
                user_email: null,
                user_name: null,
            };
        },
        computed: {

        },
        methods: {
            sendMessage(e) {
                e.preventDefault();

                this.socket.emit('SEND_MESSAGE', {
                    author: this.user_name,
                    content: this.currentContent,
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes()
                });

                this.currentContent = '';
            },
            connect() {
                axios.get('/api/login').then(response => {
                    console.log(response);
                    this.user_email = response.data.email;
                    this.user_name = response.data.name;
                }).catch(error => console.log(error));

                this.socket = io('/', {path: '/api/socket'});

                this.socket.emit('CONNECT', {
                    author: this.user
                });

                this.socket.on('USER', (data) => {
                    this.users = [...this.users, data];
                });

                this.socket.on('USERS', (data) => {
                    this.users = data;
                });

                this.socket.on('MESSAGE', (data) => {
                    this.messages = [...this.messages, data];
                });

                this.socket.on('MESSAGES', (data) => {
                    this.messages = data;
                });

                this.dateToday = new Date().getDate();
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            }
        },
        beforeMount() {
            this.connect();
        }
    };

</script>
