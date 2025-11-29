// =========================================================
// 1. DARK MODE TOGGLE
// =========================================================
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("dark-mode", isDark ? "true" : "false");
  document.querySelector("#darkModeToggle i").className = isDark
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
});

if (localStorage.getItem("dark-mode") === "true") {
  document.body.classList.add("dark-mode");
  document.querySelector("#darkModeToggle i").className = "fa-solid fa-sun";
} else {
  document.querySelector("#darkModeToggle i").className = "fa-solid fa-moon";
}

// =========================================================
// 2. SALAM BERDASARKAN WAKTU
// =========================================================
function updateGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById("mainGreeting");
  let greetingText = "";
  let emoji = "";

  if (hour >= 5 && hour < 12) {
    greetingText = "Good Morning, My Sweetest!";
    emoji = "☀️";
  } else if (hour >= 12 && hour < 18) {
    greetingText = "Good Afternoon, My Sweetest!";
    emoji = "🌤️";
  } else {
    greetingText = "Good Evening, My Sweetest!";
    emoji = "🌙";
  }

  if (greetingEl) {
    greetingEl.innerHTML = `${greetingText} ${emoji}`;
  }
}
updateGreeting();

// =========================================================
// 3. DATA & ACHIEVEMENTS UTILITY
// =========================================================
const dailyNotes = [
  "u are doing better than u think. be gentle with yourself.",
  "a small reminder: u matter to someone quietly every day.",
  "take a breath. you're allowed to rest and still be loved.",
  "u make ordinary days a little more sparkly",
  "ur smile is a soft sunrise for someone. Keep shining.",
  "i hope today gives u one tiny thing that makes your heart warm.",
];

const timelineItems = [
  {
    title: "First message",
    date: "2025-05-14",
    text: "the day i first texted u and your reply made me smile.",
  },
  {
    title: "First call",
    date: "soon",
    text: "soon",
  },
  {
    title: "First meet",
    date: "soon",
    text: "soon",
  },
];

const tilayList = [
  "the way you smile just melts my heart, it seriously makes my whole day brighter 🌸",
  "the way you talk is so adorable, it feels like my favourite little comfort, it makes my heart go all soft every time 🧸🌷",
  "your eyes feel so warm and gentle, like they’re telling me a hundred beautiful stories 🫧",
  "your kindness is so pure, it makes me admire you even more every single day 🎀",
  "your energy feels like a safe place for me, soft, calming, but still so powerful 🌷✨",
];

let currentLevel = Number(localStorage.getItem("love_level") || 100);
const toast = document.getElementById("toast");

function increaseLove(amount = 1) {
  currentLevel += amount;
  localStorage.setItem("love_level", currentLevel);
  const meterText = document.getElementById("loveLevelMeter");
  if (meterText) meterText.textContent = `Love Level: ${currentLevel}%`;
}

function saveAch(name) {
  const key = "ach_" + name;
  if (localStorage.getItem(key)) return; // only once
  localStorage.setItem(key, "1");
  showToast(`Achievement unlocked: ${name}`);
  renderAchievements();
}

function showToast(text) {
  toast.textContent = text;
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 300);
  }, 2800);
}

// Inisialisasi dan Update Love Level Meter (dibuat IIFE)
(function () {
  if (!document.getElementById("loveLevelMeter")) {
    const div = document.createElement("div");
    div.id = "loveLevelMeter";
    div.style.position = "fixed";
    div.style.right = "20px";
    div.style.top = "70px";
    div.style.background = "var(--card-bg)";
    div.style.padding = "8px 12px";
    div.style.borderRadius = "999px";
    div.style.boxShadow = "var(--shadow)";
    div.style.fontWeight = "700";
    div.style.fontSize = "0.85em";
    div.style.zIndex = "1000";
    document.body.appendChild(div);
  }
  document.getElementById(
    "loveLevelMeter"
  ).textContent = `Love Level: ${currentLevel}%`;
})();

// =========================================================
// 4. DAILY NOTE
// =========================================================
const dailyMsgEl = document.getElementById("dailyMsg");
const nextDailyBtn = document.getElementById("nextDailyBtn");

function getDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function setDailyFromStorage() {
  const k = getDateKey();
  let val = localStorage.getItem("daily_" + k);
  if (!val) {
    const pick = dailyNotes[Math.floor(Math.random() * dailyNotes.length)];
    localStorage.setItem("daily_" + k, pick);
    val = pick;
  }
  dailyMsgEl.textContent = val;
}
nextDailyBtn.addEventListener("click", () => {
  const k = getDateKey();
  const pick = dailyNotes[Math.floor(Math.random() * dailyNotes.length)];
  localStorage.setItem("daily_" + k, pick);
  dailyMsgEl.textContent = pick;
  increaseLove(2);
});
setDailyFromStorage();

// =========================================================
// 5. SLIDESHOW (Photo)
// =========================================================
const slides = [...document.querySelectorAll(".slide")];
let curSlide = 0;
function showSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === idx);
    if (i !== idx) {
      // Mengatur rotasi random untuk slide non-aktif
      s.style.transform = `rotate(${(i - 1.5) * 3}deg) scale(1)`;
    }
  });
  curSlide = idx;
}
document
  .getElementById("nextSlide")
  .addEventListener("click", () => showSlide((curSlide + 1) % slides.length));
document
  .getElementById("prevSlide")
  .addEventListener("click", () =>
    showSlide((curSlide - 1 + slides.length) % slides.length)
  );
document.getElementById("shuffleBtn").addEventListener("click", () => {
  let newIdx;
  do {
    newIdx = Math.floor(Math.random() * slides.length);
  } while (newIdx === curSlide && slides.length > 1);
  showSlide(newIdx);
  increaseLove(1);
});
showSlide(0);

// =========================================================
// 6. SOUNDTRACK & KONTROL AUDIO (UPDATED)
// =========================================================
const playlistEl = document.getElementById("playlist");
const player = document.getElementById("player");
const bgm = document.getElementById("bgm");
const nowPlaying = document.getElementById("nowPlaying");
const playPauseBtn = document.getElementById("playPauseBtn");
const stopBtn = document.getElementById("stopBtn");
let currentMood = "soft";
let lastPlayedSong = null;

function updatePlayPauseBtn(isPlaying) {
  if (isPlaying) {
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  } else {
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
  }
}

const playlists = {
  soft: [
    {
      title: "A Sorrowful Reunion - Reality Club",
      src: "realityclub.mp3",
      type: "bgm",
      img: "realityclub.jpg", // New Album Art Path
    },
    {
      title: "About You - The 1975",
      src: "aboutyou.mp3",
      type: "player",
      img: "aboutyou.jpg", // New Album Art Path
    },
  ],
  night: [
    {
      title: "Who Knows - Daniel Caesar",
      src: "Who Knows.mp3",
      type: "player",
      img: "whoknows.jpg", // New Album Art Path
    },
    {
      title: "No One Noticed (Extended English) - The marias",
      src: "no one noticed.mp3",
      type: "player",
      img: "themarias.jpg", // New Album Art Path
    },
  ],
  happy: [
    {
      title: "Strawberry Magic - Mrs. Magic",
      src: "mrsmagic.mp3",
      type: "player",
      img: "magic.jpeg", // New Album Art Path
    },
    {
      title: "Lover, You Should’ve Come Over - Jeff Buckley",
      src: "song.mp3",
      type: "player",
      img: "jeffbuckley.jpg", // New Album Art Path
    },
  ],
};

function handlePlaySong(songData) {
  const { src, title, type } = songData;
  lastPlayedSong = songData;

  if (type === "player") {
    bgm.pause();
    bgm.currentTime = 0;
    player.src = src;
    player.load();
    player.play().catch((err) => {
      console.log("Player Autoplay blocked:", err);
      updatePlayPauseBtn(false);
    });
    updatePlayPauseBtn(true);
  } else if (type === "bgm") {
    player.pause();
    player.currentTime = 0;
    bgm.src = src;
    bgm.load();
    bgm.play().catch((err) => {
      console.log("BGM Autoplay blocked:", err);
      updatePlayPauseBtn(false);
    });
    updatePlayPauseBtn(true);
  }

  nowPlaying.textContent = title;
  increaseLove(2);
  saveAch("Played a song");
}

function handleStop() {
  player.pause();
  player.currentTime = 0;
  bgm.pause();
  bgm.currentTime = 0;
  nowPlaying.textContent = "(Berhenti)";
  updatePlayPauseBtn(false);
}

function renderPlaylist(mood) {
  playlistEl.style.opacity = "0"; // Sembunyikan untuk mencegah flicker
  playlistEl.innerHTML = ""; // Hapus konten lama

  // Hapus kelas 'active' dari semua tombol mood
  document
    .querySelectorAll(".mood-btn")
    .forEach((btn) => btn.classList.remove("active"));
  // Tambahkan kelas 'active' ke tombol mood saat ini
  document.getElementById(`${mood}Mood`).classList.add("active");

  playlists[mood].forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "song";
    // Menggunakan s.img dan class .song-title yang baru
    div.innerHTML = `<img class="album-art" src="${s.img}" onerror="this.src='https://via.placeholder.com/100/e85f97/ffffff?text=♫'"><div style="flex:1"><div class="song-title">${s.title}</div><small style="color:var(--muted)">Mood: ${mood}</small></div><div><button class="btn ghost play-quick" data-index="${i}" data-mood="${mood}"><i class="fa-solid fa-play"></i></button></div>`;

    playlistEl.appendChild(div);

    // Tambahkan event listener saat elemen dibuat
    div.querySelector(".play-quick").addEventListener("click", (e) => {
      e.stopPropagation(); // Penting agar tidak mengganggu klik di div.song
      const index = parseInt(e.currentTarget.dataset.index);
      const moodKey = e.currentTarget.dataset.mood;
      handlePlaySong(playlists[moodKey][index]);
    });

    // Tambahkan event listener untuk klik di div.song (mengambil lagu yang sama)
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(div.querySelector(".play-quick").dataset.index);
      const moodKey = div.querySelector(".play-quick").dataset.mood;
      handlePlaySong(playlists[moodKey][index]);
    });
  });

  // Tampilkan kembali setelah semua elemen ditambahkan
  requestAnimationFrame(() => {
    playlistEl.style.opacity = "1";
  });
}

// Event Listeners untuk Tombol Mood
document.getElementById("softMood").addEventListener("click", () => {
  currentMood = "soft";
  renderPlaylist("soft");
  increaseLove(1);
});
document.getElementById("nightMood").addEventListener("click", () => {
  currentMood = "night";
  renderPlaylist("night");
  increaseLove(1);
});
document.getElementById("happyMood").addEventListener("click", () => {
  currentMood = "happy";
  renderPlaylist("happy");
  increaseLove(1);
});

// KONTROL PLAY/PAUSE/STOP
playPauseBtn.addEventListener("click", () => {
  if (!lastPlayedSong) {
    // Jika belum pernah play, coba putar lagu default (soft mood, lagu pertama)
    handlePlaySong(playlists.soft[0]);
    return;
  }

  let audioEl = lastPlayedSong.type === "player" ? player : bgm;

  if (audioEl.paused) {
    audioEl.play().catch((e) => console.log("Play failed:", e));
    updatePlayPauseBtn(true);
  } else {
    audioEl.pause();
    updatePlayPauseBtn(false);
  }
});

stopBtn.addEventListener("click", handleStop);

// Inisialisasi: Render playlist 'soft' dan siapkan BGM
renderPlaylist("soft");
if (playlists.soft.length > 0 && playlists.soft[0].type === "bgm") {
  bgm.src = playlists.soft[0].src;
  bgm.load();
  lastPlayedSong = playlists.soft[0];
  nowPlaying.textContent = playlists.soft[0].title;
}
updatePlayPauseBtn(false); // Pastikan tombol menampilkan "Play" saat inisialisasi

// =========================================================
// 7. MAGIC TRAIL (Mouse Follower)
// =========================================================
const floatModeSelector = document.getElementById("floatModeSelector");
let floatMode = "hearts";
floatModeSelector.addEventListener("click", (e) => {
  const b = e.target.closest(".btn");
  if (!b || !b.dataset.mode) return;
  floatMode = b.dataset.mode;

  // Hapus kelas 'active' dan 'accent' dari semua tombol
  floatModeSelector.querySelectorAll(".btn").forEach((x) => {
    x.classList.remove("accent", "active");
    x.classList.add("ghost"); // Pastikan semua tombol punya ghost
  });

  // Tambahkan kelas yang benar ke tombol yang diklik
  b.classList.add("accent", "active");
  b.classList.remove("ghost"); // Tombol aktif tidak perlu ghost

  increaseLove(1);
});

let heartsEnabled = true;
document.getElementById("toggleHearts").addEventListener("click", () => {
  heartsEnabled = !heartsEnabled;
  document.getElementById("toggleHearts").innerHTML = heartsEnabled
    ? '<i class="fa-solid fa-heart-circle-check"></i> Toggle hearts'
    : '<i class="fa-solid fa-heart-crack"></i> Enable hearts';
  increaseLove(1);
});

// Element untuk menampung floating trail
const heartContainer = document.createElement("div");
heartContainer.style.position = "fixed";
heartContainer.style.inset = "0";
heartContainer.style.pointerEvents = "none";
document.body.appendChild(heartContainer);

function makeFloat(e) {
  if (!heartsEnabled) return;
  const el = document.createElement("span");
  const emoji =
    { hearts: "❤️", sakura: "🌸", sparkle: "✨", bubble: "🫧" }[floatMode] ||
    "❤️";
  el.textContent = emoji;
  el.style.position = "fixed";
  el.style.left = e.clientX + "px";
  el.style.top = e.clientY + "px";
  el.style.zIndex = 9999;
  el.style.fontSize = "18px";
  el.style.pointerEvents = "none";
  el.style.transition = "transform 1.2s ease-out, opacity 1.2s";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = "translateY(-90px) scale(.8)";
    el.style.opacity = "0";
  });
  setTimeout(() => el.remove(), 1200);
}
document.addEventListener("mousemove", makeFloat);
document.addEventListener("click", makeFloat);

// =========================================================
// 8. RANDOM COMPLIMENT (TILAY)
// =========================================================
document.getElementById("tilayBtn").addEventListener("click", () => {
  const i = Math.floor(Math.random() * tilayList.length);
  document.getElementById("tilayDisplay").textContent = tilayList[i];
  increaseLove(3);
  saveAch("Received a compliment");
});

// =========================================================
// 9. SECRET UNLOCK
// =========================================================
const SECRET_WORD = "i love you salwa";
const secretInput = document.getElementById("secretCodeInput");
document.getElementById("checkSecretCode").addEventListener("click", () => {
  const val = secretInput.value.trim().toLowerCase();
  if (!val) return alert("Type the secret word ❤️");
  if (val === SECRET_WORD) {
    // Level 1 unlock
    alert("🔑 KUNCI DITEMUKAN! Level 1 unlocked. A surprise awaits!");
    increaseLove(100);
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
    saveAch("Found secret level 1");
    localStorage.setItem("secret_level1", "true");
  } else {
    alert("kode salah. coba lagi, hayooo apaaaa! ❤️");
  }
  secretInput.value = "";
});

// =========================================================
// 10. OUR TIMELINE
// =========================================================
const timelineEl = document.getElementById("timeline");
function renderTimeline() {
  timelineEl.innerHTML = "";
  timelineItems.forEach((t) => {
    const d = document.createElement("div");
    d.className = "mem";
    d.innerHTML = `<strong>${t.title}</strong> <small style="color:var(--muted);display:block;margin-bottom: 4px;"><i class="fa-solid fa-clock"></i> ${t.date}</small><div>${t.text}</div>`;
    timelineEl.appendChild(d);
  });
}
renderTimeline();

// =========================================================
// 11. CHAT SIMULATION
// =========================================================
const replies = [
  "i'm okay now, your message helped ☺️",
  "aww, that means a lot to me 💕",
  "thank u, u always know how to make me smile.",
];
document.getElementById("triggerReply").addEventListener("click", () => {
  const el = document.getElementById("simReply");
  el.textContent = "...";
  setTimeout(() => {
    el.textContent = replies[Math.floor(Math.random() * replies.length)];
    increaseLove(2);
    saveAch("Got a reply");
  }, 900);
});

// =========================================================
// 12. SURPRISE VIDEO MODAL
// =========================================================
const videoModal = document.getElementById("videoModal");
const surpriseVideo = document.getElementById("surpriseVideo");

document.getElementById("openVideo").addEventListener("click", () => {
  videoModal.style.display = "flex";
  surpriseVideo.currentTime = 0;
  surpriseVideo.play().catch(() => {});
  increaseLove(5);
  saveAch("Watched surprise video");
});
document.getElementById("closeVideo").addEventListener("click", () => {
  videoModal.style.display = "none";
  surpriseVideo.pause();
});

// =========================================================
// 13. CUTE NOTE MODAL
// =========================================================
const detailedLetter = `
for u, someone i admire quietly

hi salwa,
this is a little website i made for u nothing big, cuma sesuatu yang pengen aku kasih karena kamu ninggalin kesan yang warm dan genuine waktu kita sempet chat dulu.

aku suka cara kamu keliatan calm & effortless. itu alasan kenapa aku bikin ini… bukan buat bikin kamu ngerasa pressure atau apa, cuma pengen kasih sesuatu yang aku enjoy bikin.

i’m not trying to rush anything or make things complicated. i just admire u, in a simple way.

semoga website ini bisa bikin kamu senyum dikit aja kalo lagi cape atau ngerasa down.

that’s all.
keep being u, the warmest, prettiest version of yourself.
`;

const noteModal = document.getElementById("noteModal");
document.getElementById("noteContent").textContent = detailedLetter;

document.getElementById("openNote").addEventListener("click", () => {
  noteModal.style.display = "flex";
  increaseLove(5);
  saveAch("Opened the note");
});
document.getElementById("closeNote").addEventListener("click", () => {
  noteModal.style.display = "none";
});

// =========================================================
// 14. MINI GAME: CATCH HEARTS
// =========================================================
const gameOverlay = document.getElementById("gameOverlay");
const spawnArea = document.getElementById("spawnArea");
let gameRunning = false,
  score = 0,
  spawnTimer = null;

document.getElementById("openGame").addEventListener("click", () => {
  gameOverlay.style.display = "flex";
});
document.getElementById("closeGame").addEventListener("click", () => {
  stopGame();
  gameOverlay.style.display = "none";
});
document
  .getElementById("startGame")
  .addEventListener("click", () => startGame());

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  spawnArea.innerHTML = "";
  spawnTimer = setInterval(spawnHeart, 700);
  setTimeout(() => {
    // end after 25 seconds
    stopGame();
    if (score >= 10) {
      alert("You Win! 🎉 You caught " + score + " hearts!");
      increaseLove(30);
      saveAch("Won mini game");
    } else {
      alert("Game over — you caught " + score + " hearts. Try again! 💪");
    }
  }, 25000);
}

function stopGame() {
  gameRunning = false;
  clearInterval(spawnTimer);
  spawnArea.innerHTML = "";
}

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart-item";
  h.textContent = ["❤️", "💗", "💞", "💕"][Math.floor(Math.random() * 4)];
  const areaRect = spawnArea.getBoundingClientRect();
  const size = 32 + Math.random() * 30;
  const left = Math.random() * (areaRect.width - size);
  const top = Math.random() * (areaRect.height - size);
  h.style.left = left + "px";
  h.style.top = top + "px";
  h.style.fontSize = size / 2 + "px";
  h.addEventListener("click", (e) => {
    e.stopPropagation();
    score++;
    increaseLove(2);
    saveAch("Caught a heart");
    h.remove();
  });
  spawnArea.appendChild(h);
  // remove after some time
  setTimeout(() => {
    h.remove();
  }, 1800 + Math.random() * 1200);
}

// =========================================================
// 15. CONFETTI EFFECT
// =========================================================
(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "confettiCanvas";
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  let pieces = [];
  function Confetti(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = Math.random() * -12 - 4;
    this.size = 4 + Math.random() * 8;
    this.color = color;
    this.t = 0;
  }
  Confetti.prototype.update = function () {
    this.vy += 0.5;
    this.x += this.vx;
    this.y += this.vy;
    this.t++;
  };
  Confetti.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size * 0.6);
  };
  window.spawnConfetti = function (x, y, count = 80) {
    const colors = ["#ff6fa3", "#ff7fb2", "#ffe6f0", "#ffc400", "#a0d8ff"];
    for (let i = 0; i < count; i++)
      pieces.push(
        new Confetti(
          x + (Math.random() - 0.5) * 80,
          y + (Math.random() - 0.5) * 80,
          colors[Math.floor(Math.random() * colors.length)]
        )
      );
    if (!pieces.anim) {
      pieces.anim = true;
      anim();
    }
  };
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.update();
      p.draw();
    });
    pieces = pieces.filter((p) => p.y < canvas.height + 20);
    if (pieces.length > 0) requestAnimationFrame(anim);
    else pieces.anim = false;
  }
})();

// =========================================================
// 16. CLICK TRACKING & ACHIEVEMENTS
// =========================================================
function renderAchievements() {
  const container = document.getElementById("achievementsList");
  container.innerHTML = "";
  const possible = [
    "Clicked 50 times",
    "Caught a heart",
    "Watched surprise video",
    "Won mini game",
    "Found secret level 1",
    "Played a song",
    "Received a compliment",
    "Got a reply",
    "Shared a smile",
    "Opened the note",
  ];
  possible.forEach((p) => {
    if (localStorage.getItem("ach_" + p)) {
      const el = document.createElement("div");
      el.style.padding = "8px 10px";
      el.style.borderRadius = "12px";
      el.style.background = "linear-gradient(90deg,var(--accent),var(--heart))";
      el.style.color = "#fff";
      el.style.fontWeight = "600";
      el.style.fontSize = "0.85em";
      el.innerHTML = `<i class="fa-solid fa-medal"></i> ${p}`;
      container.appendChild(el);
    }
  });
}
renderAchievements();

let nonInteractiveClicks = Number(localStorage.getItem("clicks") || 0);
document.body.addEventListener("click", (e) => {
  const isInteractive = e.target.closest(
    "button, input, .song, .play-quick, .album-art, .slide"
  );
  if (!isInteractive) {
    nonInteractiveClicks++;
    localStorage.setItem("clicks", nonInteractiveClicks);
    if (nonInteractiveClicks >= 50 && nonInteractiveClicks % 50 === 0) {
      // Cek setiap 50 klik setelah mencapai 50
      showToast("You clicked a lot — thanks for the love!");
      increaseLove(2);
      saveAch("Clicked 50 times");
    }
  }
});

// =========================================================
// 17. INITIAL TRIGGERS
// =========================================================
setTimeout(() => {
  document.getElementById("tilayBtn").click(); // Trigger compliment on load
}, 1200);
setTimeout(() => {
  document.getElementById("triggerReply").click(); // Trigger chat reply on load
}, 2200);

window.addEventListener("error", (ev) => {
  // Suppress errors for missing images/files to keep console clean
});
