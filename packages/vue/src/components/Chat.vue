<template>
    <div class="chat">
        <div class="header text-light">
            <h3><span>@{{ user.name }}</span></h3>
        </div>
        <div class="content" id="content">
            <div v-if="socket">
                <div class="row">
                    <div class="col-md-9">
                        <div class="data-target list-group list-group-flush" id="box-scroll" v-chat-scroll>
                            <div class="messages"
                                 v-for="({ author, content, date, month, year, hour, minute }, index) in messages"
                                 :key="index"
                            >
                                <div v-if="author === 'ConnectionBot'"
                                     class="messageBot bg-light text-dark animated fadeInUp">
                                    <span class="font-weight-bold">🤖 {{ author }}</span>
                                    <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute}` }}
                                    </span>
                                    <br>
                                    <span>{{ content }}</span>
                                </div>
                                <div v-else-if="author !== user.name"
                                     class="messageOtherUser bg-info text-light animated fadeInUp">
                                    <span class="font-weight-bold">{{ author }}</span>
                                    <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute}` }}
                                    </span>
                                    <br>
                                    <span>{{ content }}</span>
                                </div>
                                <div v-else-if="author === user.name"
                                     class="messageUser bg-success text-light animated fadeInUp">
                                    <span class="font-weight-bold">{{ author }}</span>
                                    <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute}` }}
                                    </span>
                                    <br>
                                    <span>{{ content }}</span>
                                </div>
                                <br>
                            </div>
                            <!-- <span v-if="currentContent">{{typing}} is typing</span> -->
                        </div>
                    </div>
                    <div class="col-md-3 usersonline">
                        <div class="margin-box">
                            <h4 class="text-light">{{ `${usersOnline.length} utilisateur(s) connecté(s)` }}</h4>
                            <br>
                            <ul class="list-group list-group-flush">
                                <li v-for="user in usersOnline"
                                    class="list-group-item messages bg-info text-light wow animated fadeInUp"
                                    :key="user">{{user}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <form @submit.prevent="sendMessage">
                <div class="row">
                    <div class="col-md-10">
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

    export default {
        data() {
            return {
                messages: [],
                usersOnline: [],
                currentContent: null,
                dateToday: null,
                socket: null
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        created() {
            this.socket.on('typing', (data) => {
                this.typing = data;
            });
        },
        watch: {
            currentContent: function () {
                if (this.currentContent) {
                    this.socket.emit('typing', this.user.name);
                }
            }
        },
        methods: {
            sendMessage(e) {
                e.preventDefault();

                //const emoji = ["🙃", "😀", "🤢", "😡"];
                //const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];

                this.socket.emit('SEND_MESSAGE', {
                    author: this.user.name,
                    content: this.currentContent,
                    date: new Date().getDate(),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes(),
                });

                this.currentContent = '';
            },
            connect() {
                this.socket = io('/', { path: '/api/socket' });
                this.socket.emit('NEW_USER', this.user.name);
                this.socket.on('MESSAGE', this.addMessage);
                this.socket.on('MESSAGES', (data) => {
                    this.messages = data;
                    //console.log("obj message : " + this.messages[0].author);
                });
                this.socket.on('USERS', (users) => this.usersOnline = users);
                this.dateToday = new Date().getDate();
                console.log("objet message : " + this.messages[0].author);
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            },
        },
        beforeMount() {
            this.connect();
        },
        beforeDestroy() {
            console.log('destroy !');
            this.socket.emit('USER_LEAVE');
        }
    };
</script>
