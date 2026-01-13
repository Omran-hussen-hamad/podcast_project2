const audio = document.getElementById("audio");
const titleEl = document.getElementById("episode-title");
const favList = document.getElementById("favList");
const sidebar = document.getElementById("sidebar");
const episodesList = document.querySelector(".episodes");

let currentEpisode = "";
let currentSrc = "";

/* الحلقات الافتراضية القديمة */
const defaultEpisodes = [
    { file: "thfez.mpeg", name: "الحلقة 1: تحفيز" },
    { file: "al rzk.mpeg", name: "الحلقة 2: الرزق" },
    { file: "nho al ngah.mpeg", name: "الحلقة 3: الطريق نحو النجاح" },
    { file: "فما ظنكم.mpeg", name: "الحلقة 4: فما ظنكم برب العالمين" },
    { file: "تعلم فن الكلام.mpeg", name: "الحلقة 5: تعلم فن الكلام" },
    { file: "فن التطنيش.mpeg", name: "الحلقة 6: فن التطنيش" }
];

/* بناء قائمة الحلقات */
function loadDefaultEpisodes() {
    episodesList.innerHTML = "";
    defaultEpisodes.forEach(ep => {
        const li = document.createElement("li");
        li.textContent = ep.name;
        li.onclick = () => playEpisode("audio/" + ep.file, ep.name);
        episodesList.appendChild(li);
    });
}

/* تشغيل حلقة */
function playEpisode(src, name) {
    currentSrc = src;
    currentEpisode = name;
    audio.src = src;
    titleEl.textContent = name;
    audio.play();
}

/* تشغيل / إيقاف */
const playBtn = document.getElementById("playBtn");

function playPause() {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
}

/* لما ينتهي الصوت يرجع الرمز */
audio.addEventListener("ended", () => {
    playBtn.textContent = "▶️";
});

/* لما المستخدم يختار حلقة جديدة */
function playEpisode(src, name) {
    currentSrc = src;
    currentEpisode = name;
    audio.src = src;
    titleEl.textContent = name;
    audio.play();
    playBtn.textContent = "⏸";
}


/* تقديم وتأخير */
function forward() {
    audio.currentTime += 10;
}
function rewind() {
    audio.currentTime -= 10;
}

/* السايدبار */
function toggleSidebar() {
    sidebar.classList.toggle("open");
}

/* المفضلة */
function addToFav() {
    if (!currentEpisode) return alert("شغّل حلقة أولاً");

    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    if (!favs.includes(currentEpisode)) {
        favs.push(currentEpisode);
        localStorage.setItem("favs", JSON.stringify(favs));
        loadFavs();
        alert("تمت الإضافة إلى المفضلة ❤️");
    }
}

function loadFavs() {
    favList.innerHTML = "";
    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    favs.forEach((ep, index) => {
        let li = document.createElement("li");
        li.textContent = ep;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.style.border = "none";
        removeBtn.style.background = "none";
        removeBtn.style.cursor = "pointer";

        removeBtn.onclick = () => removeFromFav(index);

        li.appendChild(removeBtn);
        favList.appendChild(li);
    });
}

function removeFromFav(index) {
    let favs = JSON.parse(localStorage.getItem("favs")) || [];
    favs.splice(index, 1);
    localStorage.setItem("favs", JSON.stringify(favs));
    loadFavs();
}

/* إضافة حلقة جديدة */
function addEpisode() {
    const title = document.getElementById("newTitle").value;
    const file = document.getElementById("newFile").files[0];

    if (!title || !file) {
        alert("الرجاء إدخال الاسم واختيار ملف صوتي");
        return;
    }

    const url = URL.createObjectURL(file);

    const li = document.createElement("li");
    li.textContent = title;
    li.onclick = () => playEpisode(url, title);

    episodesList.appendChild(li);

    document.getElementById("newTitle").value = "";
    document.getElementById("newFile").value = "";
}
const progress = document.getElementById("progress");

/* تحديث الشريط أثناء التشغيل */
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
});

/* القفز لمكان معين عند الضغط */
function seek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
}
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
});


/* تحميل كل شيء */
loadDefaultEpisodes();
loadFavs();
