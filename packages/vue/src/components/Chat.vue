<template>
    <div class="card container chat">
        <div>
            <div class="header bg-primary text-light">
                <h3><span>@{{ user.name }}</span></h3>
            </div>
            <div class="content" id="content">
                <div v-if="socket">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="data-target" id="box-scroll" v-chat-scroll>
                                <div class="messages" id="target-message" v-for="({ author, content, date, month, year, hour, minute }, index) in messages" :key="index">
                                    <hr>
                                    <span class="font-weight-bold" v-if="author === 'ConnectionBot'">🤖 {{ author }}</span>
                                    <span class="font-weight-bold" v-else>{{ author }}</span>
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
                        <div class="col-md-4">
                            <h3>Utilisateurs connectés</h3>
                            <hr>
                            {{ `${usersOnline.length} utilisateur(s) connecté(s)` }}
                            <ul class="list-group list-group-flush">
                                <li v-for="user in usersOnline" class="list-group-item">{{user}}</li>
                            </ul>
                        </div>
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
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import Vue from 'vue';
    import VueChatScroll from 'vue-chat-scroll';
    Vue.use(VueChatScroll);

    export default {
        props: ['user'],
        data() {
            return {
                messages: [],
                usersOnline: [],
                currentContent: null,
                dateToday: null,
                socket: null,
            };
        },
        methods: {
            sendMessage(e) {
                e.preventDefault();

                const emoji = ["🙃", "😀", "🤢", "😡"];
                const randomEmoji = emoji[Math.floor(Math.random()*emoji.length)];

                this.socket.emit('SEND_MESSAGE', {
                    author: randomEmoji + this.user.name,
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
                this.socket.emit('NEW_USER', this.user.name);

                this.socket.on('MESSAGE', this.addMessage);

                this.socket.on('MESSAGES', (data) => this.messages = data);

                this.socket.on('USERS', (users) =>  {
                    this.usersOnline = users;
                });

                this.dateToday = new Date().getDate();
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            },
        },
        beforeMount() {
            this.connect();
        }
    };

</script>
