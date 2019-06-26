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
                                <div>
                                    <div v-if="author === 'ConnectionBot'"
                                         class="messageBot animated fadeInUp">
                                        <span class="font-weight-bold">🤖 {{ author }}</span>
                                        <span class="message-hour">
                                    <span v-if="( date !== dateToday )"> | Le </span>
                                    <span v-if="( date === dateToday )"> | Aujourd'hui, </span>
                                        {{ `${date}/${month}/${year} - ${hour}h${minute} `}}
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
                                        {{ `${date}/${month}/${year} - ${hour}h${minute}` }}
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
                            <h4 class="text-light">{{ `${usersOnline.length} utilisateur(s) connecté(s)` }}</h4>
                            <br>


                            <button class="btn btn-primary" @click="switchRoom">Switch room</button>
                            <button class="btn btn-primary" @click="switchGlobalRoom">Switch to global room</button>

                            <ul class="list-group list-group-flush">
                                <li
                                        v-for="({userName}, index) in usersOnline"
                                        :key="index"
                                        class="list-group-item wow animated fadeInUp"
                                >
                                    {{ userName }}
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
                    <div class="col-md-1">
                        <div v-if="!image">
                            <p>Select an image</p>
                            <input type="file" @change="onFileChange">
                        </div>
                        <div v-else>
                            <img :src="image" />
                        </div>
                    </div>
                    <div class="col-md-1">
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
                this.socket.emit('room', this.actualRoom);
                this.socket.emit('NEW_USER', this.user.name, this.user.timestamp);

                this.socket.on('MESSAGES', (messages) => {
                    this.messages = messages;
                });
                this.socket.on('USERS_ONLINE', (usersonline) => {
                    this.usersOnline = usersonline;
                });

                this.socket.on('MESSAGE', this.addMessage);
                this.dateToday = new Date().getDate();
            },
            addMessage(message) {
                this.messages = [...this.messages, message];
            },
            newUser(usersOnline){
                this.usersOnline = [...this.usersOnline, usersOnline]
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
