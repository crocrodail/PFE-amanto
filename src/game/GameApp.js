import React from "react";
import Phaser from 'phaser';
import { io, Socket } from "socket.io-client";
import Chat from "./chat";
import Map from "./map";
import Preload from "./preload";
import {
    AiOutlineClose,
} from 'react-icons/ai';
import {
    ImLocation
} from 'react-icons/im';
import {
    RiHeartsFill,
    RiRadioButtonLine
} from 'react-icons/ri';
import {
    GiBodyHeight,
    GiGraduateCap,
    GiCigarette
} from 'react-icons/gi';
import {
    MdWork,
    MdChildCare,
    MdLanguage
} from 'react-icons/md';
import {
    FaWineGlassAlt,
    FaUserFriends
} from 'react-icons/fa';
import {
    TbCandle
} from 'react-icons/tb';
import {
    SiAdblock
} from 'react-icons/si';
import {
    BsFillChatDotsFill,
    BsChatLeftText
} from 'react-icons/bs';
import {
    TiUserDeleteOutline
} from 'react-icons/ti';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import ReactModal from 'react-modal-resizable-draggable';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

class CreateGame {

    constructor() {
        let globalGame = this
        const config = {
            type: Phaser.AUTO,
            width: window.screen.availWidth,
            height: window.screen.availHeight,
            parent: "game-container",
            pixelArt: true,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 0 },
                },
            },
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };
        if (process.env.REACT_APP_ENV !== "production") {
            this.socket = io('ws://' + process.env.REACT_APP_API_URL);
        } else {
            this.socket = io('wss://' + process.env.REACT_APP_API_URL);
        }
        const game = new Phaser.Game(config);
        let cursors;
        let player;
        let playerOnline;
        let playerOnlineSprite = {};
        let updateOnline = false;

        function preload() {
            Preload(this)
        }

        function create() {
            globalGame.map = new Map(this);

            const spawnPoint = globalGame.map.terain.findObject("Objects", (obj) => obj.name === "Spawn Point");
            globalGame.player = this.physics.add
                .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
                .setSize(20, 10)
                .setOffset(5, 55)
                .setInteractive({ cursor: 'pointer' })
                .on('pointerdown', function () {
                    const profil = document.querySelector('.show-profile');
                    profil.style.display = 'block';
                });
            const collider = this.physics.add.collider(globalGame.player, globalGame.map.collides);
            globalGame.collider = collider;
            globalGame.map.collides.setCollisionBetween(3284, 3286);

            const anims = this.anims;
            anims.create({
                key: "misa-left-walk",
                frames: anims.generateFrameNames("atlas", {
                    prefix: "misa-left-walk.",
                    start: 0,
                    end: 3,
                    zeroPad: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });
            anims.create({
                key: "misa-right-walk",
                frames: anims.generateFrameNames("atlas", {
                    prefix: "misa-right-walk.",
                    start: 0,
                    end: 3,
                    zeroPad: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });
            anims.create({
                key: "misa-front-walk",
                frames: anims.generateFrameNames("atlas", {
                    prefix: "misa-front-walk.",
                    start: 0,
                    end: 3,
                    zeroPad: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });
            anims.create({
                key: "misa-back-walk",
                frames: anims.generateFrameNames("atlas", {
                    prefix: "misa-back-walk.",
                    start: 0,
                    end: 3,
                    zeroPad: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });

            const camera = this.cameras.main;
            camera.startFollow(globalGame.player);
            camera.setBounds(0, 0, globalGame.map.widthInPixels, globalGame.map.heightInPixels);
            camera.setZoom(2);

            cursors = this.input.keyboard.createCursorKeys();

            let initChat = new Chat(globalGame.socket, this, globalGame.player);

            globalGame.socket.on('updateMoves', (data) => {
                playerOnline = data;
                updateOnline = true;
            });
            globalGame.socket.on('disconect', (data) => {
                playerOnline = data.Players;
                if (playerOnlineSprite[data.socket]) {
                    playerOnlineSprite[data.socket].sprite.destroy();
                    delete playerOnlineSprite[data.socket];
                }
                updateOnline = true;
            });

            globalGame.socket.emit('connected', { x: spawnPoint.x, y: spawnPoint.y, velocity: globalGame.player.body.velocity });

        }



        let O_up = false
        let O_down = false
        let O_left = false
        let O_right = false

        function update(time, delta) {
            const speed = 175;
            const prevVelocity = globalGame.player.body.velocity.clone();
            if (globalGame.player.body.velocity.x != 0 || globalGame.player.body.velocity.y != 0) {
                globalGame.socket.emit('move',
                    {
                        x: globalGame.player.x,
                        y: globalGame.player.y,
                        prevVelocity: prevVelocity,
                        velocity: globalGame.player.body.velocity,
                        cursors: { up: cursors.up.isDown, down: cursors.down.isDown, left: cursors.left.isDown, right: cursors.right.isDown },
                    });
            }

            if (updateOnline && playerOnline) {
                for (const [key] of Object.entries(playerOnline)) {
                    if (key != globalGame.socket.id) {
                        if (playerOnlineSprite[key] == undefined) {
                            playerOnlineSprite[key] = {}
                            playerOnlineSprite[key].sprite = this.physics.add
                                .sprite(playerOnline[key].x, playerOnline[key].y, "atlas", "misa-front")
                                .setSize(30, 40)
                                .setOffset(0, 24)
                                .setInteractive({ cursor: 'pointer' })
                                .on('pointerdown', function () {
                                    const profil = document.querySelector('.show-profile');
                                    profil.style.display = 'block';
                                });

                        }
                        playerOnlineSprite[key].sprite.x = playerOnline[key].x;
                        playerOnlineSprite[key].sprite.y = playerOnline[key].y;
                        if (playerOnline[key].cursors?.up && !O_up) {
                            O_up = true;
                            playerOnlineSprite[key].sprite.anims.stop();
                            playerOnlineSprite[key].sprite.anims.play("misa-back-walk", true);
                        } else if (playerOnline[key].cursors?.down && !O_down) {
                            O_down = true;
                            playerOnlineSprite[key].sprite.anims.stop();
                            playerOnlineSprite[key].sprite.anims.play("misa-front-walk", true);
                        } else if (playerOnline[key].cursors?.left && !O_left) {
                            O_left = true;
                            playerOnlineSprite[key].sprite.anims.stop();
                            playerOnlineSprite[key].sprite.anims.play("misa-left-walk", true);
                        } else if (playerOnline[key].cursors?.right && !O_right) {
                            O_right = true;
                            playerOnlineSprite[key].sprite.anims.stop();
                            playerOnlineSprite[key].sprite.anims.play("misa-right-walk", true);
                        } else if (!playerOnline[key].cursors?.up && !playerOnline[key].cursors?.down && !playerOnline[key].cursors?.left && !playerOnline[key].cursors?.right) {
                            O_up = false;
                            O_down = false
                            O_left = false
                            O_right = false
                            playerOnlineSprite[key].sprite.anims.stop();
                            if (playerOnline[key].velocity?.x < 0) {
                                playerOnlineSprite[key].sprite.setTexture("atlas", "misa-left");
                            } else if (playerOnline[key].velocity.x > 0) {
                                playerOnlineSprite[key].sprite.setTexture("atlas", "misa-right");
                            } else if (playerOnline[key].velocity.y < 0) {
                                playerOnlineSprite[key].sprite.setTexture("atlas", "misa-back");
                            } else if (playerOnline[key].velocity.y > 0) {
                                playerOnlineSprite[key].sprite.setTexture("atlas", "misa-front");
                            }
                        }
                    }
                };
                updateOnline = false;
            }
            // Stop any previous movement from the last frame
            globalGame.player.body.setVelocity(0);

            // Horizontal movement
            if (cursors.left.isDown) {
                globalGame.player.body.setVelocityX(-speed);
            } else if (cursors.right.isDown) {
                globalGame.player.body.setVelocityX(speed);
            }

            // Vertical movement
            if (cursors.up.isDown) {
                globalGame.player.body.setVelocityY(-speed);
            } else if (cursors.down.isDown) {
                globalGame.player.body.setVelocityY(speed);
            }


            // Normalize and scale the velocity so that player can't move faster along a diagonal
            globalGame.player.body.velocity.normalize().scale(speed);

            // Update the animation last and give left/right animations precedence over up/down animations
            if (cursors.up.isDown) {
                globalGame.player.anims.play("misa-back-walk", true);
            } else if (cursors.down.isDown) {
                globalGame.player.anims.play("misa-front-walk", true);
            } else if (cursors.left.isDown) {
                globalGame.player.anims.play("misa-left-walk", true);
            } else if (cursors.right.isDown) {
                globalGame.player.anims.play("misa-right-walk", true);
            } else {
                globalGame.player.anims.stop();

                // If we were moving, pick and idle frame to use
                if (prevVelocity.y < 0) globalGame.player.setTexture("atlas", "misa-back");
                else if (prevVelocity.y > 0) globalGame.player.setTexture("atlas", "misa-front");
                else if (prevVelocity.x < 0) globalGame.player.setTexture("atlas", "misa-left");
                else if (prevVelocity.x > 0) globalGame.player.setTexture("atlas", "misa-right");
            }
        }
    }

    changeMap(map) {
        const data = this.map.change(map, this.player, this.collider);
        this.player = data.player;
        this.collider = data.collider;
    }
}





export default function GameApp() {
    const [openModal, setOpenModal] = React.useState(false);
    const [menuId, setMenuId] = React.useState(1);
    const [game, setGame] = React.useState(null);
    React.useEffect(() => {
        const myGame = new CreateGame();
        setGame(myGame);

    }, []);
    const handleMap = (map) => {
        game.changeMap(map);
    }
    return (
        <>
            <div className="App" id="game-container"></div>
            <input className="chat" type="text" placeholder="Parler ..." />
            <div className="navigation">
                <button onClick={() => setOpenModal(true)}>
                    Open modal
                </button>
                <ReactModal
                    initWidth={800}
                    initHeight={400}
                    className={"my-modal-custom-class"}
                    onRequestClose={() => setOpenModal(false)}
                    isOpen={openModal}
                    disableKeystroke="true">
                    <h3>Menu principal</h3>
                    <AiOutlineClose className="exit"
                        onClick={() => setOpenModal(false)} />
                    <div className="body">
                        <div className="menu">
                            { 
                                menuId === 1 ?
                                    <button onClick={() => setMenuId(1)} style={{ backgroundColor: "#1616ff33" }}>Lieux</button>
                                : 
                                    <button onClick={() => setMenuId(1)}>Lieux</button>
                            }
                            {
                                menuId === 2 ?
                                    <button onClick={() => setMenuId(2)} style={{ backgroundColor: "#1616ff33" }}>Amis</button>
                                    :
                                    <button onClick={() => setMenuId(2)}>Amis</button>
                            }
                            {
                                menuId === 3 ?
                                    <button onClick={() => setMenuId(3)} style={{ backgroundColor: "#1616ff33" }}>Tenues</button>
                                    :
                                    <button onClick={() => setMenuId(3)}>Tenues</button>
                            }
                        </div>
                        <div className="content">
                            {
                                menuId === 1 ?
                                    <div className="map">
                                        <div className="map-container" onClick={() => handleMap('map1')}>
                                            <p><span>0 / 50</span> - Salle de loisir</p>
                                        </div>
                                        <div className="map-container" onClick={() => handleMap('private')}>
                                            <p><span>0 / 10</span> - Mon espace privé</p>
                                        </div>
                                    </div>
                                : null
                            }
                            {
                                menuId === 2 ?
                                    <div className="friends">
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#1eff00"}} /> Raphael 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#ff0000" }} /> Pierre 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#ff0000" }} /> Lucas 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#ff0000" }} /> Jean 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#ff0000" }} /> Daniel 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="friends-container">
                                            <div className="content"><RiRadioButtonLine style={{ color: "#ff0000" }} /> Alexandre 23 ans
                                                <div>
                                                    <BsChatLeftText />
                                                    <TiUserDeleteOutline className="delete" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </ReactModal>
            </div>
            <div className="show-profile">
                <AiOutlineClose className="exit"
                onClick={()=> {
                    const profil = document.querySelector('.show-profile');
                    profil.style.display = 'none';
                }}/>
                <p className="report">Signaler</p>
                <Swiper
                    pagination={{
                        type: "fraction",
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral" alt="profile" /></SwiperSlide>
                    <SwiperSlide><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral" alt="profile" /></SwiperSlide>
                    <SwiperSlide><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral" alt="profile" /></SwiperSlide>
                    <SwiperSlide><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral" alt="profile" /></SwiperSlide>

                </Swiper>
                <div className="profile-info">
                    <h1>Misa - 25 ans</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec euismod, nisl eget consectetur sagittis,
                        nisl nisi consectetur nisi, euismod consectetur
                        nisi nisi euismod.
                    </p>
                    <div className="break"></div>
                    <div className="interaction">
                        <div className="add-friend">
                            <FaUserFriends className="icon" />
                            <p>Ajouter en ami</p>
                        </div>
                        <div className="text">
                            <BsFillChatDotsFill className="icon" />
                            <p>Chuchoter</p>
                        </div>
                        <div className="block">
                            <SiAdblock className="icon" />
                            <p>Bloquer</p>
                        </div>
                    </div>
                    <div className="break"></div>
                    <ul>
                        <li>
                            <ImLocation />
                            <span>
                                Paris
                            </span>
                        </li>
                        <li>
                            <RiHeartsFill />
                            <span>
                                Recherche: discussion, amitié, relation durable
                            </span>
                        </li>
                        <li>
                            <GiBodyHeight />
                            <span>
                                162cm
                            </span>
                        </li>
                        <li>
                            <MdWork />
                            <span>
                                Développeur web
                            </span>
                        </li>
                        <li>
                            <GiGraduateCap />
                            <span>
                                Diplomé de l'université Paris Descartes
                            </span>
                        </li>
                        <li>
                            <MdChildCare />
                            <span>
                                N'a pas d'enfants
                            </span>
                        </li>
                        <li>
                            <GiCigarette />
                            <span>
                                Jamais
                            </span>
                        </li>
                        <li>
                            <FaWineGlassAlt />
                            <span>
                                Occasionnellement
                            </span>
                        </li>
                        <li>
                            <TbCandle />
                            <span>
                                Athée
                            </span>
                        </li>
                        <li>
                            <MdLanguage />
                            <span>
                                Français, Anglais
                            </span>
                        </li>
                    </ul>
                </div>

            </div>
        </>

    );
}
