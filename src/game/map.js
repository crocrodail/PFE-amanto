class Map {

    constructor(created) {
        this.created = created;
        this.map = this.created.make.tilemap({ key: "map1" });
        this.loadAssets(this.map);
    }

    loadAssets(map) {

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
        this.terain = this.map
        this.collides = collides

    }

    change(map, game) {
        this.newMap = this.created.make.tilemap({ key: map });
        this.loadAssets(this.newMap);
        const spawnPoint = this.newMap.findObject("Objects", (obj) => obj.name === "Spawn Point");
        game.player.x = spawnPoint.x;
        game.player.y = spawnPoint.y;
        game.player.depth = game.player.depth + 1;
        this.newCollides = this.created.physics.add.collider(game.player, this.collides);
        this.collides.setCollisionBetween(3284, 3286);
        game.collider.destroy();
        this.map.destroy();
        this.map = this.newMap;
        if (game.onlinePlayer) {
            for (const [key] of Object.entries(game.onlinePlayer)) {
                if (key != game.socket.id) {
                    game.onlinePlayer[key].depth = game.player.depth;
                }
            }
        }
        if (map === "map1") {
            game.socket.emit("changeRoom", { oldRoom: game.room, newRoom: "main" });
            game.room = "main"
        } else if (map === "private") {
            game.socket.emit("changeRoom", { oldRoom: game.room, newRoom: game.player.info.pseudo });
            game.room = game.player.pseudo
        }
        return { map: this.map, collider: this.newCollides, player: game.player};
    }
}

export default Map;