class Chat {
    messages = [];

    constructor(socket, game, player, room) {
        this.socket = socket;
        this.game = game;
        this.player = player;
        this.room = room;
        this.style = { fontFamily: 'Verdana', color: '#fff', fontSize: 12, backgroundColor: '#000', padding: { x: 10, y: 3 } }
        this.init();
    }

    init() {
        setInterval(() => {
            for (const message of this.messages) {
                if (message.entity){
                    message.entity.y = message.entity.y - 20;
                    message.y = message.y - 20;
                    if (message.entity.y < -100) {
                        message.entity.destroy();
                        const index = this.messages.indexOf(message);
                        this.messages.splice(index, 1);
                    }
                }
            }
        }
        , 2000);

        this.input = document.querySelector('.chat');
        this.input.addEventListener('keydown', (e) => {
            if (e.keyCode === 32) {
                this.input.value = this.input.value + ' ';
            }
            if (e.keyCode === 13) {
                this.sendMessage(this.input.value);
                this.input.value = '';
            }
        })

        this.socket.on('chat', (message) => {
            if (this.messages[this.messages.length - 1]?.y > message.y - 20) {
                for (const msg of this.messages) {
                    if (msg.entity) {
                        msg.entity.y = msg.y - 20;
                        msg.y = msg.y - 20;
                    }
                }
            }
            const text = this.game.add.text(message.x, message.y, `${message.pseudo}: ${message.text}`, this.style);
            text.setDepth(10);
            text.setPosition(message.x - text.width / 2, message.y);
            const msg = { x: message.x - text.width / 2, y: message.y, text: `${message.pseudo}: ${message.text}`, entity: text }
            this.messages.push(msg)
        })
    }

    sendMessage(message) {
        const msg = { pseudo: this.player.info.pseudo, text: message, x: this.player.x, y: this.player.y - 40, room: this.room };
        this.socket.emit('chat', msg);
    }

}

export default Chat;