const fs = require("fs");

const filePath = "src/data/gallery.json";
const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const quotes = {
  "garden_photoshoot_img_1_2915": ["Among the Blooms", "Some places just make you feel alive."],
  "garden_photoshoot_img_2_2919": ["Pink and Free", "She needed no reason to look this beautiful."],
  "garden_photoshoot_img_3_3000": ["Sunlit Silk", "Tradition worn lightly, joy carried fully."],
  "candid_home_img_1_2924": ["Space Girl Vibes", "Reaching for stars, one lazy morning at a time."],
  "evening_party_img_1_2929": ["Lights and Laughter", "She walked in and the room rearranged itself."],
  "evening_party_img_2_2933": ["Garden Glow", "Fairy lights, greener dreams, one perfect night."],
  "casual_outdoor_img_1_2945": ["Easy Like Sunday", "Style that never tries too hard hits the hardest."],
  "casual_outdoor_img_2_2949": ["Open Sky Open Mind", "Some afternoons just ask to be savoured."],
  "festival_celebration_img_1_2954": ["Festival Ready", "Gold on her wrists, joy in her eyes."],
  "video_clips_img_1_3191": ["Just a Tuesday", "The unplanned ones always turn out best."],
  "video_clips_img_2_3195": ["Caught Off Guard", "Real laughs cannot be scripted."],
  "video_clips_img_3_3199": ["In the Middle of It", "Life happening, camera rolling."],
  "video_clips_img_4_3202": ["Soft Hours", "Nothing big. Everything good."],
  "video_clips_img_6_3227": ["That Kind of Day", "The ones worth keeping are rarely the planned ones."],
  "video_clips_img_7_3240": ["Pure Candid", "Blinked and it became a favourite memory."],
  "video_clips_img_8_3256": ["Just Being", "No filter needed for the real thing."],
  "video_clips_img_9_3264": ["One More Take", "Every moment deserves a second look."],
  "urban_stroll_img_1_3100": ["City Calm", "She moves through noise like she invented quiet."],
  "urban_stroll_img_2_3103": ["Afternoon Wander", "Getting a little lost is the whole point."],
  "waiting_area_img_1_3111": ["Between Places", "Even waiting looks good on her."],
  "waiting_area_img_2_3115": ["Cap and Calm", "A thought passing through. Worth catching."],
  "waiting_area_img_3_3119": ["Platform Grace", "Arrivals and departures. She is the constant."],
  "festival_celebration_img_1_2958": ["Red and Radiant", "Tradition that makes your heart race a little."],
  "festival_celebration_img_1_2963": ["Warm and Wild", "Festive colours suit people who feel everything deeply."],
  "festival_celebration_img_2_2986": ["Marigold Mood", "She is the celebration."],
  "festival_celebration_img_3_3005": ["Orange Glow", "Silk, sun, and the best kind of festival energy."],
  "candid_home_img_1_2967": ["Thursday, Softly", "Some days are just too pretty not to document."],
  "candid_home_img_2_2976": ["Butterflies at Home", "Joy is a white top and a quiet afternoon."],
  "candid_home_img_1_2971": ["Monochrome Mood", "Hearts everywhere. Stillness inside."],
  "candid_home_img_2_2990": ["Soft Grey Hours", "The prettiest moments are never posed."],
  "candid_home_img_3_3041": ["Afternoon Light", "She glows even when no one is watching."],
  "candid_home_img_4_3053": ["Sunspill", "Light finds her the way it finds open windows."],
  "casual_outdoor_img_1_2996": ["Red at Dusk", "Bold colours for people who feel deeply."],
  "casual_outdoor_img_1_3013": ["Soft Gaze, Blue Day", "Some looks say everything without a word."],
  "casual_outdoor_img_2_3017": ["Wooden Pillar Light", "She finds the good light wherever she stands."],
  "casual_outdoor_img_4_3160": ["Garden and Grace", "Patterns on fabric, peace in the air."],
  "casual_outdoor_img_5_3176": ["Golden Afternoon", "An ordinary day. She made it feel extraordinary."],
  "cafe_outing_img_1_3025": ["Red in the City", "Coffee, city walls, and that smile."],
  "transit_img_1_3030": ["Thumbs Up for Everything", "Optimism is a full-time look."],
  "transit_img_2_3038": ["Window Seat Thoughts", "Best views come with the best company."],
  "transit_img_3_3045": ["Morning Light on Glass", "Moving always. Glowing always."],
  "casual_outdoor_img_1_3034": ["Golden Together", "Some smiles warm you from the outside in."],
  "casual_outdoor_img_2_3067": ["Corner of the Garden", "She always finds the prettiest corner."],
  "candid_home_img_1_3049": ["Warm and Simple", "Home looks better when she is in it."],
  "evening_party_img_1_3056": ["Ascending in Gold", "She does not enter a room. She arrives."],
  "evening_party_img_2_3071": ["Fairy Light Glow", "Gold fabric, soft light, no bad angles."],
  "evening_party_img_3_3083": ["Shimmer at Dusk", "The evening bent itself around her."],
  "evening_party_img_4_3086": ["Stone Steps, Silk Drape", "Classic is just another word for timeless."],
  "evening_party_img_5_3089": ["Festive Poise", "Every detail, every light, made for tonight."],
  "evening_party_img_1_3062": ["Dancing in Gold", "Joy looks best when it is moving."],
  "evening_party_img_2_3075": ["Gilded Smile", "The warmest thing in the room was not the lights."],
  "evening_party_img_3_3080": ["Gold in Motion", "She laughed and the whole evening sparkled."],
  "festival_celebration_img_1_3092": ["Teal and Timeless", "Some traditions feel like coming home."],
  "festival_celebration_img_2_3096": ["Gold Meets Teal", "Quiet corner. Loudest presence."],
  "festival_celebration_img_3_3107": ["Soft Glow, Strong Roots", "Every fold of the saree carries a story."],
  "birthday_celebration_img_1_3122": ["Twenty-One and Glowing", "Blush dress, big dreams, whole life ahead."],
  "candid_home_img_1_3126": ["Phone in Hand, Smile On", "Even a scroll break looks this good."],
  "candid_home_img_2_3133": ["Pearls and Peace", "Quiet moments with the prettiest details."],
  "candid_home_img_3_3142": ["Soft Scroll, Soft Smile", "She makes the ordinary feel wonderfully gentle."],
  "workshop_img_1_3129": ["Hands in Clay", "She creates the way she lives, with full hands and a full heart."],
  "birthday_celebration_img_1_3136": ["Another Year, Lovelier", "Each birthday just looks better on her."],
  "evening_party_img_1_3139": ["Poolside at Dusk", "Still water, still evening, perfect moment."],
  "transit_img_1_3146": ["Plaid and Moving", "Every city street is a runway if you walk it right."],
  "cafe_outing_img_1_3149": ["Mirror, Mirror", "Good style and a good cafe. Name a better duo."],
  "rooftop_evening_img_1_3152": ["City and Her", "Rooftops and city lights, her natural habitat."],
  "candid_home_img_1_3164": ["Olive and Easy", "Some smiles just make the whole room warmer."],
  "cafe_outing_img_1_3169": ["Roses at Night", "White blooms, soft evening, one lovely pause."],
  "casual_outdoor_img_1_3182": ["Sunlight Through Leaves", "The world is prettier when you are wrapped in colour."],
  "candid_home_img_1_3186": ["Teal at Home", "Dressed like a celebration, glowing like one too."],
};

function updateItems(items) {
  for (const item of items) {
    if (quotes[item.id]) {
      item.title = quotes[item.id][0];
      item.caption = quotes[item.id][1];
    }
    if (item.images) updateItems(item.images);
    if (item.items) updateItems(item.items);
  }
}

if (parsed.featured && parsed.featured.images) updateItems(parsed.featured.images);
if (parsed.albums) {
  for (const album of parsed.albums) {
    if (album.items) {
      for (const occ of album.items) {
        if (occ.images) updateItems(occ.images);
      }
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
console.log("All " + Object.keys(quotes).length + " captions and titles updated with beautiful quotes!");
