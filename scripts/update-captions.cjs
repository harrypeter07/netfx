const fs = require("fs");

const filePath = "src/data/gallery.json";
const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const quotes = {
  "garden_photoshoot_img_1_2915": ["Among the Blooms", "Sometimes the most beautiful path is the one you walk together."],
  "garden_photoshoot_img_2_2919": ["Pink and Free", "Her laughter is the kind that fills a room with instant warmth."],
  "garden_photoshoot_img_3_3000": ["Sunlit Silk", "A beautiful blend of heritage, grace, and an unforgettable smile."],
  "candid_home_img_1_2924": ["Space Girl Vibes", "Chasing stars, but finding magic in the simplest mornings."],
  "evening_party_img_1_2929": ["Lights and Laughter", "A presence so bright, even the stars take notes."],
  "evening_party_img_2_2933": ["Garden Glow", "Wrapped in fairy lights and the magic of a starlit dream."],
  "casual_outdoor_img_1_2945": ["Easy Like Sunday", "Effortless elegance, where simplicity meets pure grace."],
  "casual_outdoor_img_2_2949": ["Open Sky Open Mind", "Soft whispers of breeze, and a moment that stands still."],
  "festival_celebration_img_1_2954": ["Festival Ready", "Adorned in traditions, but her smile remains the brightest jewel."],
  "video_clips_img_1_3191": ["Just a Tuesday", "The sweet magic of captured whispers and unscripted laughter."],
  "video_clips_img_2_3195": ["Caught Off Guard", "Moments where the heart laughs first, and the camera follows."],
  "video_clips_img_3_3199": ["In the Middle of It", "Life is a collection of beautiful scenes, and you are the main character."],
  "video_clips_img_4_3202": ["Soft Hours", "Soft smiles, quiet hours, and memories to hold forever."],
  "video_clips_img_6_3227": ["That Kind of Day", "The best memories are the ones that caught us completely by surprise."],
  "video_clips_img_7_3240": ["Pure Candid", "A fleeting second of pure joy, saved in a frame forever."],
  "video_clips_img_8_3256": ["Just Being", "No filters needed when you are glowing from the inside out."],
  "video_clips_img_9_3264": ["One More Take", "Every smile tells a story of a moment too beautiful to forget."],
  "urban_stroll_img_1_3100": ["City Calm", "Moving gracefully through the city breeze like a sweet melody."],
  "urban_stroll_img_2_3103": ["Afternoon Wander", "Wandering with a light heart and finding joy in every step."],
  "waiting_area_img_1_3111": ["Between Places", "Making the quietest waiting moments look like a scene from a movie."],
  "waiting_area_img_2_3115": ["Cap and Calm", "Lost in a lovely dream, caught under the soft morning light."],
  "waiting_area_img_3_3119": ["Platform Grace", "Amidst the rush of arrivals and departures, she is the serene constant."],
  "festival_celebration_img_1_2958": ["Red and Radiant", "Draped in crimson tradition, capturing every eye in the room."],
  "festival_celebration_img_1_2963": ["Warm and Wild", "Warm colors and deep smiles for a soul that glows so brightly."],
  "festival_celebration_img_2_2986": ["Marigold Mood", "Some people don't just attend celebrations—they are the celebration."],
  "festival_celebration_img_3_3005": ["Orange Glow", "Sunlit silk and festive laughter, the perfect harmony of joy."],
  "candid_home_img_1_2967": ["Thursday, Softly", "A quiet afternoon, a gentle gaze, and memories worth holding onto."],
  "candid_home_img_2_2976": ["Butterflies at Home", "Simple styles and happy hearts make the most beautiful days."],
  "candid_home_img_1_2971": ["Monochrome Mood", "A monochrome frame of quiet peace and gentle thoughts."],
  "candid_home_img_2_2990": ["Soft Grey Hours", "Unposed, authentic, and carrying the sweetest grace of home."],
  "candid_home_img_3_3041": ["Afternoon Light", "Sunlight in her hair, peace in her heart, glowing effortlessly."],
  "candid_home_img_4_3053": ["Sunspill", "Beautiful light always finds its way to a beautiful soul."],
  "casual_outdoor_img_1_2996": ["Red at Dusk", "Dressed in crimson dusk, carrying a quiet confidence."],
  "casual_outdoor_img_1_3013": ["Soft Gaze, Blue Day", "A soft gaze that speaks a thousand words without saying one."],
  "casual_outdoor_img_2_3017": ["Wooden Pillar Light", "A serene interlude, finding warmth in every sun-dappled corner."],
  "casual_outdoor_img_4_3160": ["Garden and Grace", "Elegance in every pattern, tranquility in every breath."],
  "casual_outdoor_img_5_3176": ["Golden Afternoon", "Basking in the golden hour, turning an ordinary day into a dream."],
  "cafe_outing_img_1_3025": ["Red in the City", "Warm coffee, urban streets, and a smile that makes the world stop."],
  "transit_img_1_3030": ["Thumbs Up for Everything", "A thumbs-up for life, carrying pure happiness wherever she goes."],
  "transit_img_2_3038": ["Window Seat Thoughts", "A window seat commute, framing a gentle and warm smile."],
  "transit_img_3_3045": ["Morning Light on Glass", "A journey in frames, radiating brightness with every mile."],
  "casual_outdoor_img_1_3034": ["Golden Together", "Warm laughter under the open sky, shared with those who matter most."],
  "casual_outdoor_img_2_3067": ["Corner of the Garden", "Sun-dappled paths, finding peace in the heart of nature."],
  "candid_home_img_1_3049": ["Warm and Simple", "Soft light and simple styles, making home the coziest place to be."],
  "evening_party_img_1_3056": ["Ascending in Gold", "Ascending in pure gold and shadow, defining what elegance means."],
  "evening_party_img_2_3071": ["Fairy Light Glow", "Fairy lights and golden threads, a glowing portrait of starlight."],
  "evening_party_img_3_3083": ["Shimmer at Dusk", "Whispering breezes and golden hours, painting a portrait of grace."],
  "evening_party_img_4_3086": ["Stone Steps, Silk Drape", "Rich tapestries and timeless steps, standing out in classic style."],
  "evening_party_img_5_3089": ["Festive Poise", "Draped in festive elegance, a perfect reflection of a magical night."],
  "evening_party_img_1_3062": ["Dancing in Gold", "Twirling in gold, letting the laughter carry the night away."],
  "evening_party_img_2_3075": ["Gilded Smile", "Golden drapes and gentle smiles, carrying warmth that outshines starlight."],
  "evening_party_img_3_3080": ["Gold in Motion", "A joyful laugh, turning the starlit night into a festival of gold."],
  "festival_celebration_img_1_3092": ["Teal and Timeless", "Wrapped in teal and gold, embodying the timeless beauty of roots."],
  "festival_celebration_img_2_3096": ["Gold Meets Teal", "Quiet corners and glowing patterns, a silent statement of poise."],
  "festival_celebration_img_3_3107": ["Soft Glow, Strong Roots", "A serene teal silhouette, where every fold carries a beautiful story."],
  "birthday_celebration_img_1_3122": ["Twenty-One and Glowing", "A twenty-first year milestone, glowing with dreams and soft blush pink."],
  "candid_home_img_1_3126": ["Phone in Hand, Smile On", "A quiet pause, catching digital smiles in the warmth of home."],
  "candid_home_img_2_3133": ["Pearls and Peace", "Pearls, soft light, and the gentle beauty of a quiet afternoon."],
  "candid_home_img_3_3142": ["Soft Scroll, Soft Smile", "A sweet digital reverie, reflecting genuine warmth and happiness."],
  "workshop_img_1_3129": ["Hands in Clay", "Hands in clay, heart in art, molding beautiful things with a smile."],
  "birthday_celebration_img_1_3136": ["Another Year, Lovelier", "A new chapter of life, unfolding with sweetness and pink charm."],
  "evening_party_img_1_3139": ["Poolside at Dusk", "Poolside reflections under the twilight sky, where peace meets style."],
  "transit_img_1_3146": ["Plaid and Moving", "Walking through transit with a classic print and an effortless stride."],
  "cafe_outing_img_1_3149": ["Mirror, Mirror", "Mirrored arches and green cafes, a reflection of style and warm coffee."],
  "rooftop_evening_img_1_3152": ["City and Her", "Skyline views and urban breeze, she fits perfectly in the city glow."],
  "candid_home_img_1_3164": ["Olive and Easy", "Earthy tones and happy smiles, bringing quiet radiance to the day."],
  "cafe_outing_img_1_3169": ["Roses at Night", "White roses, soft evenings, and a smile as sweet as the blooms."],
  "casual_outdoor_img_1_3182": ["Sunlight Through Leaves", "Sun-dappled grace, letting the colors flow like a vibrant poem."],
  "candid_home_img_1_3186": ["Teal at Home", "Ethereal grace, glowing warmly in the quiet comfort of home."],
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
