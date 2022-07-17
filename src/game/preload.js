export default Preload;

function Preload(game) {
    game.load.image("Room_Builder", "../assets/tilesets/Room_Builder_48x48.png");
    game.load.image("Generic", "../assets/tilesets/1_Generic_48x48.png");
    game.load.image("LivingRoom", "../assets/tilesets/2_LivingRoom_48x48.png");
    game.load.image("Bathroom", "../assets/tilesets/3_Bathroom_48x48.png");
    game.load.image("Bedroom", "../assets/tilesets/4_Bedroom_48x48.png");
    game.load.image("Classroom_and_library", "../assets/tilesets/5_Classroom_and_library_48x48.png");
    game.load.image("Music_and_sport", "../assets/tilesets/6_Music_and_sport_48x48.png");
    game.load.image("Art", "../assets/tilesets/7_Art_48x48.png");
    game.load.image("Gym", "../assets/tilesets/8_Gym_48x48.png");
    game.load.image("Fishing", "../assets/tilesets/9_Fishing_48x48.png");
    game.load.image("Birthday_party", "../assets/tilesets/10_Birthday_party_48x48.png");
    game.load.image("Halloween", "../assets/tilesets/11_Halloween_48x48.png");
    game.load.image("Kitchen", "../assets/tilesets/12_Kitchen_48x48.png");
    game.load.image("Conference_Hall", "../assets/tilesets/13_Conference_Hall_48x48.png");
    game.load.image("Basement", "../assets/tilesets/14_Basement_48x48.png");
    game.load.image("Christmas", "../assets/tilesets/15_Christmas_48x48.png");
    game.load.image("Grocery_store", "../assets/tilesets/16_Grocery_store_48x48.png");
    game.load.image("Visibile_Upstairs_System", "../assets/tilesets/17_Visibile_Upstairs_System_48x48.png");
    game.load.image("Jail", "../assets/tilesets/18_Jail_48x48.png");
    game.load.image("Hospital", "../assets/tilesets/19_Hospital_48x48.png");
    game.load.image("Japanese_interiors", "../assets/tilesets/20_Japanese_interiors_48x48.png");
    game.load.image("Clothing_Store", "../assets/tilesets/21_Clothing_Store_48x48.png");
    game.load.image("Museum", "../assets/tilesets/22_Museum_48x48.png");
    game.load.image("Tevelision_and_Film_Studio", "../assets/tilesets/23_Tevelision_and_Film_Studio_48x48.png");
    game.load.image("Tevelision_and_Film_Studio_Shadowless", "../assets/tilesets/23_Tevelision_and_Film_Studio_Shadowless_48x48.png");
    game.load.image("Ice_Cream_Shop", "../assets/tilesets/24_Ice_Cream_Shop_48x48.png");
    game.load.image("Shooting_Range", "../assets/tilesets/25_Shooting_Range_48x48.png");
    game.load.image("Condominium", "../assets/tilesets/26_Condominium_48x48.png");

    game.load.tilemapTiledJSON("map1", "../assets/tilemaps/map1.json");
    game.load.tilemapTiledJSON("private", "../assets/tilemaps/private.json");
    game.load.atlas("atlas", "../assets/atlas/atlas.png", "../assets/atlas/atlas.json");
}