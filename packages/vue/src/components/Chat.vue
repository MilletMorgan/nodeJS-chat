<template>
    <div class="card container chat">
        <div class="header bg-primary text-light">
            <h3><span>@{{ this.user }}</span></h3>
            <button v-if="socket" type="button" class="btn btn-outline-warning" @click="disconnect">Se déconnecter</button>
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
                    <span v-if="currentContent">{{ `${this.user}  écrit...` }}</span>
                </div>
            </div>
            <div v-else>
                <p>Merci de vous connecter.</p>
            </div>
        </div>
        <div class="footer bg-primary text-light">
            <form @submit.prevent="connect" v-if="!socket" class="">
                <div class="form-group">
                    <label for="user">Nom d'utilisateur :</label>
                    <input type="text" v-model="user" class="form-control" id="user">
                </div>
                <button type="submit" class="btn btn-outline-success">Se connecter</button>
            </form>
            <form @submit.prevent="sendMessage" v-else>
                <div class="form-group pb-3">
                    <label for="message">Message</label>
                    <input type="text" v-model="currentContent" class="form-control" id="message">
                </div>
                <button type="submit" class="btn btn-outline-success">Envoyer</button>
            </form>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import Vue from 'vue';
    import VueChatScroll from 'vue-chat-scroll';
    Vue.use(VueChatScroll);

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
                socket: null
            };
        },
        methods: {
            sendMessage(e) {
                e.preventDefault();

                this.socket.emit('SEND_MESSAGE', {
                    author: this.user,
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
            disconnect() {
                this.socket.close();
                this.socket = null;
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            }
        },
    };

</script>
