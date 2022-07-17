import React from "react";
import Phaser from 'phaser';
import { io, Socket } from "socket.io-client";
import Chat from "./chat";
import {
    AiOutlineClose,
} from 'react-icons/ai';
import {
    ImLocation
} from 'react-icons/im';
import {
    RiHeartsFill
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
    BsFillChatDotsFill
} from 'react-icons/bs';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function CreateGame() {

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
    const socket = io('ws://' + process.env.REACT_APP_API_URL);
    const game = new Phaser.Game(config);
    let cursors;
    let player;
    let playerOnline;
    let playerOnlineSprite = {};
    let updateOnline = false;
    let showDebug = false;

    function Vector2(x, y) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
    }

    function preload() {
        this.load.image("Room_Builder", "../assets/tilesets/Room_Builder_48x48.png");
        this.load.image("Generic", "../assets/tilesets/1_Generic_48x48.png");
        this.load.image("LivingRoom", "../assets/tilesets/2_LivingRoom_48x48.png");
        this.load.image("Bathroom", "../assets/tilesets/3_Bathroom_48x48.png");
        this.load.image("Bedroom", "../assets/tilesets/4_Bedroom_48x48.png");
        this.load.image("Classroom_and_library", "../assets/tilesets/5_Classroom_and_library_48x48.png");
        this.load.image("Music_and_sport", "../assets/tilesets/6_Music_and_sport_48x48.png");
        this.load.image("Art", "../assets/tilesets/7_Art_48x48.png");
        this.load.image("Gym", "../assets/tilesets/8_Gym_48x48.png");
        this.load.image("Fishing", "../assets/tilesets/9_Fishing_48x48.png");
        this.load.image("Birthday_party", "../assets/tilesets/10_Birthday_party_48x48.png");
        this.load.image("Halloween", "../assets/tilesets/11_Halloween_48x48.png");
        this.load.image("Kitchen", "../assets/tilesets/12_Kitchen_48x48.png");
        this.load.image("Conference_Hall", "../assets/tilesets/13_Conference_Hall_48x48.png");
        this.load.image("Basement", "../assets/tilesets/14_Basement_48x48.png");
        this.load.image("Christmas", "../assets/tilesets/15_Christmas_48x48.png");
        this.load.image("Grocery_store", "../assets/tilesets/16_Grocery_store_48x48.png");
        this.load.image("Visibile_Upstairs_System", "../assets/tilesets/17_Visibile_Upstairs_System_48x48.png");
        this.load.image("Jail", "../assets/tilesets/18_Jail_48x48.png");
        this.load.image("Hospital", "../assets/tilesets/19_Hospital_48x48.png");
        this.load.image("Japanese_interiors", "../assets/tilesets/20_Japanese_interiors_48x48.png");
        this.load.image("Clothing_Store", "../assets/tilesets/21_Clothing_Store_48x48.png");
        this.load.image("Museum", "../assets/tilesets/22_Museum_48x48.png");
        this.load.image("Tevelision_and_Film_Studio", "../assets/tilesets/23_Tevelision_and_Film_Studio_48x48.png");
        this.load.image("Tevelision_and_Film_Studio_Shadowless", "../assets/tilesets/23_Tevelision_and_Film_Studio_Shadowless_48x48.png");
        this.load.image("Ice_Cream_Shop", "../assets/tilesets/24_Ice_Cream_Shop_48x48.png");
        this.load.image("Shooting_Range", "../assets/tilesets/25_Shooting_Range_48x48.png");
        this.load.image("Condominium", "../assets/tilesets/26_Condominium_48x48.png");

        this.load.tilemapTiledJSON("map", "../assets/tilemaps/map1.json");
        this.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
    }

    function create() {
        const map = this.make.tilemap({ key: "map" });
        const Room_Builder = map.addTilesetImage("Room_Builder_48x48", "Room_Builder");
        const Generic = map.addTilesetImage("1_Generic_48x48", "Generic");
        const LivingRoom = map.addTilesetImage("2_LivingRoom_48x48", "LivingRoom");
        const Bathroom = map.addTilesetImage("3_Bathroom_48x48", "Bathroom");
        const Bedroom = map.addTilesetImage("4_Bedroom_48x48", "Bedroom");
        const Classroom_and_library = map.addTilesetImage("5_Classroom_and_library_48x48", "Classroom_and_library");
        const Music_and_sport = map.addTilesetImage("6_Music_and_sport_48x48", "Music_and_sport");
        const Art = map.addTilesetImage("7_Art_48x48", "Art");
        const Gym = map.addTilesetImage("8_Gym_48x48", "Gym");
        const Fishing = map.addTilesetImage("9_Fishing_48x48", "Fishing");
        const Birthday_party = map.addTilesetImage("10_Birthday_party_48x48", "Birthday_party");
        const Halloween = map.addTilesetImage("11_Halloween_48x48", "Halloween");
        const Kitchen = map.addTilesetImage("12_Kitchen_48x48", "Kitchen");
        const Conference_Hall = map.addTilesetImage("13_Conference_Hall_48x48", "Conference_Hall");
        const Basement = map.addTilesetImage("14_Basement_48x48", "Basement");
        const Christmas = map.addTilesetImage("15_Christmas_48x48", "Christmas");
        const Grocery_store = map.addTilesetImage("16_Grocery_store_48x48", "Grocery_store");
        const Visibile_Upstairs_System = map.addTilesetImage("17_Visibile_Upstairs_System_48x48", "Visibile_Upstairs_System");
        const Jail = map.addTilesetImage("18_Jail_48x48", "Jail");
        const Hospital = map.addTilesetImage("19_Hospital_48x48", "Hospital");
        const Japanese_interiors = map.addTilesetImage("20_Japanese_interiors_48x48", "Japanese_interiors");
        const Clothing_Store = map.addTilesetImage("21_Clothing_Store_48x48", "Clothing_Store");
        const Museum = map.addTilesetImage("22_Museum_48x48", "Museum");
        const Tevelision_and_Film_Studio = map.addTilesetImage("23_Tevelision_and_Film_Studio_48x48", "Tevelision_and_Film_Studio");
        const Tevelision_and_Film_Studio_Shadowless = map.addTilesetImage("23_Tevelision_and_Film_Studio_Shadowless_48x48", "Tevelision_and_Film_Studio_Shadowless");
        const Ice_Cream_Shop = map.addTilesetImage("24_Ice_Cream_Shop_48x48", "Ice_Cream_Shop");
        const Shooting_Range = map.addTilesetImage("25_Shooting_Range_48x48", "Shooting_Range");
        const Condominium = map.addTilesetImage("26_Condominium_48x48", "Condominium");

        const tilesets = [
            Room_Builder, Generic, LivingRoom, Bathroom, Bedroom, Classroom_and_library,
            Music_and_sport, Art, Gym, Fishing, Birthday_party, Halloween,
            Kitchen, Conference_Hall, Basement, Christmas, Grocery_store,
            Visibile_Upstairs_System, Jail, Hospital, Japanese_interiors,
            Clothing_Store, Museum, Tevelision_and_Film_Studio,
            Tevelision_and_Film_Studio_Shadowless, Ice_Cream_Shop,
            Shooting_Range, Condominium
        ];

        const belowLayer = map.createLayer("Below Player", tilesets, 0, 0);
        const belowLayer2 = map.createLayer("Below Player2", tilesets, 0, 0);
        const worldLayer = map.createLayer("World", tilesets, 0, 0);
        const worldLayer2 = map.createLayer("World2", tilesets, 0, 0);
        const aboveLayer = map.createLayer("Above Player", tilesets, 0, 0);
        const collides = map.createLayer("Collides", Room_Builder, 0, 0);

        collides.setCollisionByProperty({ collides: true });
        aboveLayer.setDepth(10);

        const spawnPoint = map.findObject("Objects", (obj) => obj.name === "Spawn Point");
        player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
            .setSize(20, 10)
            .setOffset(5, 55)
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', function () {
                const profil = document.querySelector('.show-profile');
                profil.style.display = 'block';
            });

        // player2 = this.physics.add
        //     .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
        //     .setSize(30, 40)
        //     .setOffset(0, 24);


        this.physics.add.collider(player, collides);
        collides.setCollisionBetween(3284, 3286);

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
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(2);

        cursors = this.input.keyboard.createCursorKeys();

        // this.add
        //     .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
        //         font: "18px monospace",
        //         fill: "#000000",
        //         padding: { x: 20, y: 10 },
        //         backgroundColor: "#ffffff",
        //     })
        //     .setScrollFactor(0)
        //     .setDepth(30);

        // Debug graphics
        // this.input.keyboard.once("keydown-D", (event) => {
        //     // Turn on physics debugging to show player's hitbox
        //     this.physics.world.createDebugGraphic();

        //     // Create worldLayer collision graphic above the player, but below the help text
        //     const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
        //     worldLayer.renderDebug(graphics, {
        //         tileColor: null, // Color of non-colliding tiles
        //         collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //         faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        //     });
        // });

        let initChat = new Chat(socket, this, player);

        socket.on('updateMoves', (data) => {
            playerOnline = data;
            updateOnline = true;
        });
        socket.on('disconect', (data) => {
            playerOnline = data.Players;
            if (playerOnlineSprite[data.socket]) {
                playerOnlineSprite[data.socket].sprite.destroy();
                delete playerOnlineSprite[data.socket];
            }
            updateOnline = true;
        });

        socket.emit('connected', { x: spawnPoint.x, y: spawnPoint.y, velocity: player.body.velocity });

    }

    let O_up = false
    let O_down = false
    let O_left = false
    let O_right = false

    function update(time, delta) {
        const speed = 175;
        const prevVelocity = player.body.velocity.clone();
        if (player.body.velocity.x != 0 || player.body.velocity.y != 0) {
            socket.emit('move', 
            { 
                x: player.x,
                y: player.y,
                prevVelocity: prevVelocity,
                velocity: player.body.velocity,
                cursors: {up: cursors.up.isDown, down: cursors.down.isDown, left: cursors.left.isDown, right: cursors.right.isDown},
            });
        }

        if (updateOnline && playerOnline) {
            for (const [key] of Object.entries(playerOnline)) {
                if (key != socket.id) {
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
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(speed);
        }


        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (cursors.up.isDown) {
            player.anims.play("misa-back-walk", true);
        } else if (cursors.down.isDown) {
            player.anims.play("misa-front-walk", true);
        } else if (cursors.left.isDown) {
            player.anims.play("misa-left-walk", true);
        } else if (cursors.right.isDown) {
            player.anims.play("misa-right-walk", true);
        } else {
            player.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
            else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
            else if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
            else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
        }
    }
}




export default function GameApp() {
    React.useEffect(() => {
        CreateGame();

    }, []);
    return (
        <>
            <div className="App" id="game-container"></div>
            <input className="chat" type="text" placeholder="Parler ..." />
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
