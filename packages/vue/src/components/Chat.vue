<template>
    <div class="chat">
        <div class="header">
            <h3 class="wow animated fadeIn"><span>@{{ user.name }}</span></h3>
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
                                <div>
                                    <div v-if="author === 'ConnectionBot'"
                                         class="messageBot animated fadeInUp">
                                        <span class="font-weight-bold">🤖 {{ author }}</span>
                                        <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute} | ${actualRoom} `}}
                                    </span>
                                        <br>
                                        <span>{{ content }}</span>
                                    </div>
                                    <div v-else-if="author !== user.name"
                                         class="messageOtherUser animated fadeInUp">
                                        <span class="font-weight-bold">{{ author }}</span>
                                        <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute} | ${actualRoom} `}}
                                    </span>
                                        <br>
                                        <span>{{ content }}</span>
                                    </div>
                                    <div v-else-if="author === user.name"
                                         class="messageUser animated fadeInUp">
                                        <span class="font-weight-bold">{{ author }}</span>
                                        <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute} | ${actualRoom} `}}
                                    </span>
                                        <br>
                                        <span>{{ content }}</span>
                                    </div>
                                </div>
                                <br>
                            </div>
                            <div class="messages"
                                 v-for="({ author, content, date, month, year, hour, minute }, index) in messageBot"
                                 :key="index"
                            >
                                <div>
                                    <div class="messageBot animated fadeInUp">
                                        <span class="font-weight-bold">🤖 {{ author }}</span>
                                        <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute} `}}
                                    </span>
                                        <br>
                                        <span>{{ content }}</span>
                                    </div>
                                </div>
                                <br>
                            </div>
                            <!-- <span v-if="currentContent">{{typing}} is typing</span> -->
                        </div>
                    </div>
                    <div class="col-md-3 usersonline">
                        <div class="margin-box">
                            <h4 class="wow animated fadeIn">{{ `${usersOnline.length} utilisateur(s)
                                connecté(s)` }}</h4>
                            <br>

                            <button class="btn btn-primary wow animated fadeIn" @click="switchRoom">Switch room</button>
                            <button class="btn btn-primary wow animated fadeIn" @click="switchGlobalRoom">Switch to
                                global room
                            </button>

                            <ul class="list-group list-group-flush">
                                <li
                                    v-for="index in usersOnline"
                                    :key="index"
                                    class="list-group-item wow animated fadeInUp"
                                >
                                    {{ index }}
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
                messageBot: [],
                userRoom: null,
                currentContent: null,
                dateToday: null,
                socket: null,
                actualRoom: "globalRoom",
                image: '',
                file: null
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
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
                    image: this.file
                });

                this.currentContent = '';
            },
            connect() {
                this.socket = io('/', { path: '/api/socket' });
                //this.socket.emit('switchRoom', this.actualRoom, this.actualRoom);
                //this.switchGlobalRoom();
                this.socket.emit('NEW_USER', this.user.name, this.user.timestamp);

                this.socket.on('MESSAGES', (messages, messageBot) => {
                    this.messages = messages;
                    this.messageBot = messageBot;
                });

                this.socket.on('USERS_ONLINE', (usersonline) => {

                    usersonline.forEach((user) => {
                        user.forEach((userName) => {
                            this.usersOnline.push(userName.userName);
                        })
                    });
                    //this.usersOnline = usersonline;


                });

                this.socket.on('MESSAGE', this.addMessage);
                this.dateToday = new Date().getDate();
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            },
            newUser(usersOnline) {
                this.usersOnline = [...this.usersOnline, usersOnline];
            },
            switchRoom() {
                //this.messages = [];
                let newsroom = "newsroom";
                this.socket.emit('switchRoom', this.actualRoom, newsroom);
                this.actualRoom = newsroom;
            },
            switchGlobalRoom() {
                //this.messages = [];
                let newsroom = "globalRoom";
                this.socket.emit('switchRoom', this.actualRoom, newsroom);
                this.actualRoom = newsroom;
            },
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
                this.file = files[0];
            },
            createImage(file) {
                this.image = new Image();
                const reader = new FileReader();
                const vm = this;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            roomWithUser() {
                let room = this.userRoom;
                this.actualRoom = room;
                this.socket.emit('switchRoom', room);
            }
        },
        beforeMount() {
            this.connect();
        },
        beforeDestroy() {
            //console.log('destroy !');
            this.socket.emit('USER_LEAVE');
        }
    };
</script>
