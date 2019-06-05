<template>
    <div class="card mt-3 container chat">
        <div class="header bg-primary text-light">
            <h2>Chat Group</h2>
            <h3><span>@{{ this.user }}</span></h3>
        </div>
        <div class="content" id="content">
            <div v-if="socket">
                <div class="data-target" id="box-scroll">
                    <div class="messages" id="target-message" v-for="({ author, content, hour, minute }, index) in messages" :key="index">
                        <p>
                            <span class="font-weight-bold">{{ author }}</span>
                            <span class="message-hour"> - {{ hour }}h <span v-if="minute < 10">0</span>{{ minute }}</span>
                            <br>
                            {{ content }}
                            <br><hr/>
                        </p>
                    </div>
                    <span v-if="currentContent">{{ author }} écrit...</span>
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
                <button type="submit" class="btn btn-success">Se connecter</button>
            </form>
            <form @submit.prevent="sendMessage" v-else class="">
                <div class="form-group pb-3">
                    <label for="message">Message</label>
                    <input type="text" v-model="currentContent" class="form-control" id="message">
                </div>
                <button type="submit" class="btn btn-secondary">Envoyer</button>
                <button type="button" class="btn btn-warning" @click="disconnect">Se déconnecter</button>
            </form>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        data() {
            return {
                user: null,
                currentContent: null,
                messages: [],
                users: [],
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
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes(),
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
