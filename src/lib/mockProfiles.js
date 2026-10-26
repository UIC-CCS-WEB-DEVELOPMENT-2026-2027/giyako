// Mock campus profiles. Their logs reference media ids from the backend catalog
// (title/type/year are embedded so the app still works if the backend is offline;
// poster images are filled in from the backend catalog when it's reachable).
const MEDIA = [
  [1, "Interstellar", "movie", 2014], [2, "Inception", "movie", 2010],
  [3, "Breaking Bad", "tv", 2008], [4, "Elden Ring", "game", 2022],
  [5, "Blonde", "music", 2016], [6, "The Dark Knight", "movie", 2008],
  [7, "Spirited Away", "movie", 2001], [8, "Parasite", "movie", 2019],
  [9, "La La Land", "movie", 2016], [10, "Everything Everywhere All at Once", "movie", 2022],
  [11, "Stranger Things", "tv", 2016], [12, "Arcane", "tv", 2021],
  [13, "The Bear", "tv", 2022], [14, "Avatar: The Last Airbender", "tv", 2005],
  [15, "Squid Game", "tv", 2021], [16, "Hunter x Hunter", "anime", 2011],
  [17, "Haikyu!!", "anime", 2014], [18, "Attack on Titan", "anime", 2013],
  [19, "Your Name", "anime", 2016], [20, "Fullmetal Alchemist: Brotherhood", "anime", 2009],
  [21, "Frieren: Beyond Journey's End", "anime", 2023], [22, "Demon Slayer", "anime", 2019],
  [23, "Stardew Valley", "game", 2016], [24, "Hades", "game", 2020],
  [25, "The Legend of Zelda: Breath of the Wild", "game", 2017], [26, "Genshin Impact", "game", 2020],
  [27, "Celeste", "game", 2018], [28, "Minecraft", "game", 2011],
  [29, "Valorant", "game", 2020], [30, "Currents", "music", 2015],
  [31, "SOS", "music", 2022], [32, "IGOR", "music", 2019],
  [33, "Random Access Memories", "music", 2013], [34, "Lover", "music", 2019],
  [35, "Hit Me Hard and Soft", "music", 2024], [36, "Norwegian Wood", "book", 1987],
  [37, "Project Hail Mary", "book", 2021], [38, "The Song of Achilles", "book", 2011],
  [39, "Atomic Habits", "book", 2018], [40, "Pride and Prejudice", "book", 1813],
  [41, "Dune", "book", 1965], [42, "Circe", "book", 2018],
];

const BY_ID = Object.fromEntries(
  MEDIA.map(([id, title, media_type, year]) => [id, { id, title, media_type, year, creator: "", poster_url: null }])
);

const person = (id, name, program, handle, pronouns, description, socials, color, logIds) => ({
  id,
  name,
  program,
  handle,
  pronouns,
  description,
  avatar: null, // initials avatar
  color,
  visibility: "My campus",
  socials: ["instagram", "tiktok", "discord"].map((type) => ({ type, value: socials[type] ?? "" })),
  logs: logIds.map((i) => BY_ID[i]), // first log = featured pick
});

export const MOCK_PROFILES = [
  person("p1", "Alex Rivera", "BS Computer Engineering", "alexrivera", "he/him",
    "Robotics club by day, Hades runs by night. Ask me about my Arduino rover.",
    { instagram: "alexrivera", discord: "alexrivera" }, "#1f4a3a", [24, 23, 1, 12, 32, 30, 41]),
  person("p2", "Sophia Chen", "BS Information Systems", "sophiachen", "she/her",
    "Spreadsheets, sad indie music and way too many book recs.",
    { instagram: "sophiachen", tiktok: "sophiachen" }, "#6b3b4a", [37, 38, 5, 31, 13, 9, 42, 36]),
  person("p3", "Mika Tan", "BS Computer Science", "mikatan", "they/them",
    "Anime marathons and co-op games. Frieren is the best thing I've watched all year.",
    { tiktok: "mikatan", discord: "mikatan" }, "#4a3b6b", [21, 16, 19, 26, 27, 28, 17, 33]),
  person("p4", "Jae Park", "BS Data Science", "jaepark", "he/him",
    "Plotting everything. Currently re-watching Breaking Bad for the cinematography.",
    { instagram: "jaepark" }, "#3b4a6b", [3, 2, 6, 8, 15, 35, 39, 25]),
  person("p5", "Noor Haddad", "BS Information Tech", "noorhaddad", "she/her",
    "Web dev, slow mornings, fantasy novels and the occasional Zelda weekend.",
    { instagram: "noorhaddad", discord: "noorhaddad" }, "#5a3e2b", [41, 40, 38, 7, 14, 23, 34]),
  person("p6", "Leo Santos", "BS Computer Science", "leosantos", "he/him",
    "Boulders, board games, Elden Ring. Not necessarily in that order.",
    { tiktok: "leosantos", discord: "leosantos" }, "#2f5d50", [4, 29, 25, 10, 11, 22, 18, 32]),
  person("p7", "Priya Nair", "BS Information Systems", "priyanair", "she/her",
    "Product design nerd. Always down for coffee and a film recommendation.",
    { instagram: "priyanair" }, "#6b3b4a", [9, 10, 7, 31, 34, 13, 37]),
  person("p8", "Dani Cruz", "BS Computer Engineering", "danicruz", "they/them",
    "Making things with sensors. Music taste: chaotic.",
    { instagram: "danicruz", tiktok: "danicruz" }, "#4a3b6b", [24, 27, 12, 30, 33, 5, 20]),
];
