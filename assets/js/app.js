(function () {
  const $ = (s) => document.getElementById(s);
  const audio = $("audio-player");
  const playBtn = $("play-btn");
  const iconPlay = $("icon-play");
  const iconPause = $("icon-pause");
  const progressBar = $("progress-bar");
  const progressContainer = $("progress-container");
  const playerAlbum = $("player-album");
  const playerBg = $("player-bg");
  const playerTitle = $("player-title");
  const playerArtist = $("player-artist");
  const modal = $("project-modal");
  const modalContent = $("modal-content");
  const fullscreenModal = $("fullscreen-modal");
  const fullscreenImage = $("fullscreen-image");

  let currentTrackIndex = 0;

  function renderTags() {
    const el = $("tags-container");
    el.innerHTML = myTags
      .map(
        (tag, i) =>
          `<span class="${tagColors[i % tagColors.length]} transition text-[10px] px-2 py-0.5 rounded-full font-medium border">${tag}</span>`
      )
      .join("");
  }

  function renderPlaylist() {
    const el = $("playlist-container");
    el.innerHTML = playlistTracks
      .map(
        (t, i) => `
      <div onclick="playTrack(${i})" class="playlist-item flex justify-between items-center p-2 rounded-md hover:bg-gh_hover transition cursor-pointer" data-index="${i}">
        <div class="flex items-center gap-2">
          <span class="text-gh_muted text-[10px] font-mono w-3">${t.num}</span>
          <div class="truncate max-w-[120px]">
            <p class="track-title text-gh_text text-[11px] truncate">${t.title}</p>
            <p class="text-gh_muted text-[9px] truncate">${t.artist}</p>
          </div>
        </div>
        <span class="text-gh_muted text-[10px] font-mono">${t.duration}</span>
      </div>`
      )
      .join("");
  }

  function buildProjectCard(p, i) {
    return `
    <div onclick="openModal(${i})" class="bg-gh_card/90 backdrop-blur-xl p-5 rounded-xl border border-gh_border hover:border-gh_muted transition duration-300 flex flex-col h-full relative overflow-hidden group cursor-pointer shadow-md">
      <div class="absolute inset-y-0 right-0 w-3/4 z-0 pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity">
        <img src="${p.bg}" class="w-full h-full object-cover" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-r from-gh_card via-gh_card/80 to-transparent"></div>
      </div>
      <div class="relative z-10 flex flex-col h-full">
        <div class="flex items-center gap-2 mb-2">
          <i class="ri-book-mark-line text-gh_muted text-sm"></i>
          <span class="text-sm font-semibold text-gh_blue group-hover:underline break-all">${p.title}</span>
          <span class="text-[9px] text-gh_muted border border-gh_border rounded-full px-1.5 py-0.5 ml-auto font-medium">${p.visibility}</span>
        </div>
        <p class="text-gh_muted text-xs mb-4 line-clamp-2">${p.desc}</p>
        <div class="flex items-center gap-3 text-[10px] text-gh_muted mt-auto pt-2">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full ${p.lang_color}"></span>
            <span>${p.lang}</span>
          </div>
          <span class="flex items-center gap-1"><i class="ri-star-line"></i>${p.stars}</span>
          <span class="flex items-center gap-1"><i class="ri-git-branch-line"></i>${p.forks}</span>
        </div>
      </div>
    </div>`;
  }

  function renderProjects() {
    const c1 = $("projects-container-1");
    const c2 = $("projects-container-2");
    const html1 = [];
    const html2 = [];
    projectData.forEach((p, i) => {
      (i % 2 === 0 ? html1 : html2).push(buildProjectCard(p, i));
    });
    c1.innerHTML = html1.join("");
    c2.innerHTML = html2.join("");
  }

  // Modal
  window.openModal = function (index) {
    const d = projectData[index];
    $("modal-title").textContent = d.title;
    $("modal-desc").textContent = d.desc;
    $("modal-image").src = d.screenshot;

    const btnGh = $("modal-github");
    const btnWeb = $("modal-website");
    btnGh.style.display = d.github_link ? "inline-flex" : "none";
    btnGh.href = d.github_link || "#";
    btnWeb.style.display = d.website_link ? "inline-flex" : "none";
    btnWeb.href = d.website_link || "#";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    requestAnimationFrame(() => {
      modal.classList.remove("opacity-0");
      modalContent.classList.replace("scale-95", "scale-100");
    });
  };

  window.closeModal = function () {
    modal.classList.add("opacity-0");
    modalContent.classList.replace("scale-100", "scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }, 300);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Fullscreen
  window.openFullscreenModal = function () {
    fullscreenImage.src = $("modal-image").src;
    fullscreenModal.classList.remove("hidden");
  };

  window.closeFullscreenModal = function (e) {
    if (e) e.stopPropagation();
    fullscreenModal.classList.add("hidden");
  };

  fullscreenModal.addEventListener("click", (e) => {
    if (e.target === fullscreenModal) closeFullscreenModal();
  });

  // Escape key — single listener
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!fullscreenModal.classList.contains("hidden")) return closeFullscreenModal();
    if (!modal.classList.contains("hidden")) return closeModal();
  });

  // Music Player
  function loadTrack(i) {
    const t = playlistTracks[i];
    audio.src = t.src;
    playerTitle.textContent = t.title;
    playerArtist.textContent = t.artist;
    playerAlbum.src = t.img;
    if (playerBg) playerBg.src = t.img;
    document.querySelectorAll(".playlist-item").forEach((el, idx) => {
      el.classList.toggle("track-active", idx === i);
    });
  }

  function setPlayIcon(playing) {
    iconPlay.classList.toggle("hidden", playing);
    iconPause.classList.toggle("hidden", !playing);
  }

  window.playTrack = function (i) {
    currentTrackIndex = i;
    loadTrack(i);
    audio.play();
    setPlayIcon(true);
  };

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      setPlayIcon(true);
    } else {
      audio.pause();
      setPlayIcon(false);
    }
  });

  $("next-btn").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlistTracks.length;
    playTrack(currentTrackIndex);
  });

  $("prev-btn").addEventListener("click", () => {
    currentTrackIndex =
      (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
    playTrack(currentTrackIndex);
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    }
  });

  progressContainer.addEventListener("click", (e) => {
    audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlistTracks.length;
    playTrack(currentTrackIndex);
  });

  // Init
  renderTags();
  renderPlaylist();
  renderProjects();
  if (playlistTracks.length) loadTrack(0);
})();
