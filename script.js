// ========= AUDIO MANAGER =========
let currentAudio = null;

function playTrack(src, loop = true, vol = 0.6) {
  if (!src) return;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = vol;
  audio.play().catch((e) => console.log("Autoplay blocked — click first"));
  currentAudio = audio;
  updatePlayerUI(src);
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  updatePlayerUI(null);
}

// ========= MUSIC PLAYER UI =========
const playButton = document.getElementById('play');
const playIcon = playButton.querySelector('i');
const titleElement = document.getElementById('title');
const trackTimeElement = document.getElementById('track-time');
const progressFilled = document.querySelector('.progress-filled');

function updatePlayerUI(src) {
  if (!src) {
    titleElement.textContent = 'No Track Playing';
    trackTimeElement.textContent = '0:00';
    progressFilled.style.width = '0%';
    playIcon.classList.replace('fa-pause', 'fa-play');
    return;
  }
  // test
  const filename = src.split('/').pop().replace('.mp3', '').replace('.wav', '');
  titleElement.textContent = filename;
  /*
  titleElement.classList.remove('scrolling');
  setTimeout(() => {
    const container = titleElement.parentElement.parentElement; // .track-title
    if (titleElement.offsetWidth > container.offsetWidth) {
      titleElement.classList.add('scrolling');
    }
  }, 0);
  */
  if (currentAudio) {
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', () => {
      playIcon.classList.replace('fa-pause', 'fa-play');
    });
  }
}

function updateProgress() {
  if (currentAudio && currentAudio.duration) {
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressFilled.style.width = `${progress}%`;
    trackTimeElement.textContent = formatTime(currentAudio.currentTime);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

playButton.addEventListener('click', () => {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
    playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    currentAudio.pause();
    playIcon.classList.replace('fa-pause', 'fa-play');
  }
});

// COOLDOWN FOLK PLEASE I SUCK BUNS AT JS IM ACTUALLY GONNA LEARN TS CAUSE I DIDNT REALISE HOW BOOTY CHEEKS AI WAS HOLYYY//

let globalCooldown = false;
let isTransitioning = false;

document.addEventListener("click", (e) => {
  if (globalCooldown || isTransitioning) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log("Blocked");
    return;
  }

  globalCooldown = true;

  setTimeout(() => {
    globalCooldown = false;
  }, 300);

}, true);

// absolute cinema son lets flipping go this global cooldown is #copyrighted //

// ========= DATA (FILL THESE IN) =========
const stations = [
  {
    id: "central",
    name: "CENTRAL STATION",
    time: "09:00",
    platform: "Plat. 1",
    stationImage: "img/legreen.png",
    stationAudio: "mptree/temmy.mp3",
    outsideImage: "https://placehold.co/1920x1080/2a2a2a/999999?text=CENTRAL+YARD",
    outsideAudio: "mptree/sanic.wav",
    outsideDesc: "Empty tracks. A single streetlamp. Distant city hum.",
    tintColor: "#ffcf4a"
  },
  {
    id: "cliffs",
    name: "COASTAL CLIFFS",
    time: "09:45",
    platform: "Plat. 3",
    stationImage: "https://preview.redd.it/i-am-so-excited-to-have-big-underwater-areas-v0-kz1o0qplm2mg1.png?width=1080&crop=smart&auto=webp&s=472a15dcb16115ec102adc786319795b456f7d25",
    stationAudio: "",
    outsideImage: "https://placehold.co/1920x1080/3a6a5a/aaffcc?text=COASTAL+CLIFFS",
    outsideAudio: "",
    outsideDesc: "Wind off the sea. Gulls circling. Infinite horizon.",
    tintColor: "#6ec8ff"
  },
  {
    id: "forest",
    name: "WHISPERING FOREST",
    time: "10:15",
    platform: "Plat. 5",
    stationImage: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/hollow-knight-silksong/5/54/Hollow_Knight_Silksong_-_DeepDocksSecrets1.jpg",
    stationAudio: "",
    outsideImage: "https://placehold.co/1920x1080/2a5a3a/aaffaa?text=DEEP+FOREST",
    outsideAudio: "",
    outsideDesc: "Sunlight through canopy. Moss and memory. Unseen footsteps.",
    tintColor: "#7acc5e"
  },
  {
    id: "park",
    name: "ABANDONED PARK",
    time: "11:00",
    platform: "Plat. 8",
    stationImage: "https://placehold.co/1920x1080/4a2a3a/cfaacc?text=PARK+STATION",
    stationAudio: "",
    outsideImage: "https://placehold.co/1920x1080/5a3a4a/ffaacc?text=AMUSEMENT+PARK",
    outsideAudio: "",
    outsideDesc: "Ferris wheel frozen. Weeds through the tracks. Faint calliope.",
    tintColor: "#d97a2b"
  },
  {
    id: "lake",
    name: "GLASS LAKE",
    time: "11:45",
    platform: "Plat. 5",
    stationImage: "https://placehold.co/1920x1080/2a3f5a/aacdff?text=LAKE+STATION",
    stationAudio: "",
    outsideImage: "https://placehold.co/1920x1080/3a5f8a/aaeeff?text=GLASS+LAKE",
    outsideAudio: "",
    outsideDesc: "Mirror water. No ripples. No birds. Submerged chords.",
    tintColor: "#88ccff"
  },
];

// Default map image
const defaultMapImage = "img/lemap.png";

// ========= GLOBAL VARIABLES =========
const transitionOverlay = document.getElementById("transitionOverlay");
const stationContainer = document.getElementById("stationContainer");
const outsideContainer = document.getElementById("outsideContainer");
let pendingAction = null;
let currentStationId = "central";

// ========= GO TO STATION =========
async function goToStation(targetStation, useTrain = false) {
  const targetView = document.getElementById(`station_${targetStation.id}`);
  if (!targetView) return;

  await transitionTo(targetView, { type: useTrain ? "train" : "default" });

  // Update background and play audio
  targetView.style.backgroundImage = `url('${targetStation.stationImage}')`;
  if (targetStation.stationAudio && targetStation.stationAudio.trim()) {
    playTrack(targetStation.stationAudio, true, 0.5);
  } else {
    stopAudio();
  }
  currentStationId = targetStation.id;
  attachExitEvents();
}

function createMapOverlay() {
  if (document.getElementById("mapOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "mapOverlay";
  overlay.className = "map-overlay";
  overlay.innerHTML = `
        <div class="map-image-container">
            <img id="mapImage" src="${defaultMapImage}" alt="Station Map">
        </div>
    `;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMap();
    }
  });

  document.body.appendChild(overlay);
}

function openMap() {
  const overlay = document.getElementById("mapOverlay");
  if (overlay) {
    overlay.classList.add("active");
  }
}

function closeMap() {
  const overlay = document.getElementById("mapOverlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
}

// ========= TRANSITION WITH SLIDING TRAIN =========
async function transitionTo(targetView, options = {}) {

  if (isTransitioning) return;
  isTransitioning = true;

  const { type = "default" } = options;
  const trainSprite = document.getElementById("trainSprite");
  
  return new Promise(async (resolve) => {
if (type === "train" && trainSprite) {
    trainSprite.style.display = "block";
    

  // remember to change when i update the train sprite thingo!!! 
    await new Promise(r => setTimeout(r, 50));
    trainSprite.style.left = "-10%";
    await new Promise(r => setTimeout(r, 800));
    
    trainSprite.style.left = "120%";
    await new Promise(r => setTimeout(r, 500));
    trainSprite.style.display = "none";

    trainSprite.style.left = "-200%";
}
    
    // Black screen wipe
    transitionOverlay.classList.add("active");
    if (type === "train") {
      transitionOverlay.classList.add("train");
    }
    
    setTimeout(() => {
      document.querySelectorAll(".fullscreen").forEach((view) => {
        view.classList.remove("active-view");
      });
      targetView.classList.add("active-view");
      
      setTimeout(() => {
        transitionOverlay.classList.remove("active");
        transitionOverlay.classList.remove("train");

        isTransitioning = false;

        resolve();
      }, 100);
    }, 400);
  });
}

// ========= CREATE ALL STATIONS =========
function buildAllStations() {
  stationContainer.innerHTML = "";

  stations.forEach((station) => {
    // Station view
    const stationDiv = document.createElement("div");
    stationDiv.id = `station_${station.id}`;
    stationDiv.className = "fullscreen view";
    stationDiv.style.backgroundImage = `url('${station.stationImage}')`;

    // ========= TOGGLE BUTTON =========
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "ribbon-toggle";
    toggleBtn.innerHTML = "📋 SHOW DEPARTURES ▼";

    // Departures board container (starts hidden)
    const boardContainer = document.createElement("div");
    boardContainer.className = "departures-board";
    boardContainer.style.display = "none";

    // Frame div (for background image)
    const frameDiv = document.createElement("div");
    frameDiv.className = "departures-frame";

    // Content div (for padding)
    const contentDiv = document.createElement("div");
    contentDiv.className = "departures-content";

    // List of ALL possible departure rows with TEXT data
    const allDepartureRows = [
      { 
        img: "img/train1.png", 
        destId: "cliffs", 
        destName: "COASTAL CLIFFS", 
        time: "09:45", 
        platform: "Plat. 3", 
        status: "On Time",
        statusColor: "#4caf50"
      },
      { 
        img: "img/train2.png", 
        destId: "forest", 
        destName: "WHISPERING FOREST", 
        time: "10:15", 
        platform: "Plat. 5", 
        status: "On Time",
        statusColor: "#4caf50"
      },
      { 
        img: "img/train3.png", 
        destId: "park", 
        destName: "ABANDONED PARK", 
        time: "11:00", 
        platform: "Plat. 8", 
        status: "Delayed",
        statusColor: "#ff9800"
      },
      { 
        img: "img/train4.png", 
        destId: "lake", 
        destName: "GLASS LAKE", 
        time: "11:45", 
        platform: "Plat. 5", 
        status: "On Time",
        statusColor: "#4caf50"
      },
      { 
        img: "img/train5.png", 
        destId: "central", 
        destName: "CENTRAL STATION", 
        time: "09:00", 
        platform: "Plat. 1", 
        status: "On Time",
        statusColor: "#4caf50"
      },
    ];

    // Filter out the row that matches the current station
    const departureRows = allDepartureRows.filter(row => row.destId !== station.id);

    // Add rows to contentDiv with TEXT OVERLAY
    departureRows.forEach((row) => {
      // Create container for image + text overlay
      const rowContainer = document.createElement("div");
      rowContainer.className = "departure-row-container";
      rowContainer.style.position = "relative";
      rowContainer.style.width = "100%";
      rowContainer.style.cursor = "pointer";
      rowContainer.style.marginBottom = "8px";
      
      // The image (your train1-5.png)
      const rowImg = document.createElement("img");
      rowImg.src = row.img;
      rowImg.className = "departure-row-img";
      rowImg.style.width = "100%";
      rowImg.style.display = "block";
      
      // Text overlay div
      const textOverlay = document.createElement("div");
      textOverlay.className = "departure-text-overlay";
      textOverlay.innerHTML = `
        <span class="overlay-time" style="color: ${station.tintColor || '#ffcf4a'}">${row.time}</span>
        <span class="overlay-destination">${row.destName}</span>
        <span class="overlay-platform">${row.platform}</span>
        <span class="overlay-status" style="color: ${row.statusColor}">${row.status}</span>
      `;
      
      rowContainer.appendChild(rowImg);
      rowContainer.appendChild(textOverlay);
      
      rowContainer.addEventListener("click", () => {
        const targetStation = stations.find((s) => s.id === row.destId);
        if (targetStation) {
          boardContainer.style.display = "none";
          toggleBtn.innerHTML = "📋 SHOW DEPARTURES ▼";
          goToStation(targetStation, true);
        }
      });
      
      rowContainer.addEventListener("mouseenter", () => {
        rowContainer.style.transform = "scale(0.99)";
        rowContainer.style.transition = "transform 0.1s";
      });
      rowContainer.addEventListener("mouseleave", () => {
        rowContainer.style.transform = "scale(1)";
      });
      
      contentDiv.appendChild(rowContainer);
    });

    // Assemble
    frameDiv.appendChild(contentDiv);
    boardContainer.appendChild(frameDiv);
    
    // Toggle button functionality
    toggleBtn.addEventListener("click", () => {
      const isVisible = boardContainer.style.display !== "none";
      boardContainer.style.display = isVisible ? "none" : "flex";
      toggleBtn.innerHTML = isVisible ? "📋 SHOW DEPARTURES ▼" : "📋 HIDE DEPARTURES ▲";
    });

    // Map icon
    const mapIcon = document.createElement("div");
    mapIcon.className = "map-icon";
    mapIcon.innerHTML = `<img src="img/wheremap.png" alt="Map Icon">`;
    mapIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      openMap();
    });

    // Exit zones
    const exitLeft = document.createElement("div");
    exitLeft.className = "exit-zone exit-left";
    exitLeft.innerHTML = '<div class="exit-indicator">⟣  EXIT  ⟢</div>';
    exitLeft.addEventListener("click", () => handleExit(station.id));

    const exitRight = document.createElement("div");
    exitRight.className = "exit-zone exit-right";
    exitRight.innerHTML = '<div class="exit-indicator">⟣  EXIT  ⟢</div>';
    exitRight.addEventListener("click", () => handleExit(station.id));

    // Add everything to station
    stationDiv.appendChild(toggleBtn);
    stationDiv.appendChild(boardContainer);
    stationDiv.appendChild(mapIcon);
    stationDiv.appendChild(exitLeft);
    stationDiv.appendChild(exitRight);

    stationContainer.appendChild(stationDiv);

    // Outside view for this station
    const outsideDiv = document.createElement("div");
    outsideDiv.id = `outside_${station.id}`;
    outsideDiv.className = "fullscreen view";
    outsideDiv.style.backgroundImage = `url('${station.outsideImage}')`;
    outsideDiv.innerHTML = `
      <div class="outside-panel">
        <p style="color:#ffffff; margin-bottom:12px;">🌲 ${station.outsideDesc}</p>
        <button class="action-btn return-to-station-btn" data-id="${station.id}">🚪 BACK TO ${station.name}</button>
      </div>
    `;
    outsideContainer.appendChild(outsideDiv);
  });
}

// ========= ATTACH EXIT ZONE EVENTS =========
function attachExitEvents() {
  stations.forEach((station) => {
    const stationDiv = document.getElementById(`station_${station.id}`);
    if (!stationDiv) return;

    const leftZone = stationDiv.querySelector(".exit-left");
    const rightZone = stationDiv.querySelector(".exit-right");

    if (leftZone) {
      const newLeft = leftZone.cloneNode(true);
      leftZone.parentNode.replaceChild(newLeft, leftZone);
      newLeft.addEventListener("click", () => handleExit(station.id));
    }
    if (rightZone) {
      const newRight = rightZone.cloneNode(true);
      rightZone.parentNode.replaceChild(newRight, rightZone);
      newRight.addEventListener("click", () => handleExit(station.id));
    }
  });
}

function handleExit(stationId) {
  const station = stations.find((s) => s.id === stationId);
  if (station) {
    goToOutside(station);
  }
}

// ========= ATTACH RETURN BUTTONS =========
function attachReturnButtons() {
  document.querySelectorAll(".return-to-station-btn").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", handleReturnToStation);
  });
}

function handleReturnToStation(e) {
  const stationId = e.currentTarget.getAttribute("data-id");
  const station = stations.find((s) => s.id === stationId);
  if (station) {
    goToStation(station);
  }
}

// ========= NAVIGATION =========
async function goToOutside(station) {
  const outsideView = document.getElementById(`outside_${station.id}`);
  if (!outsideView) return;

  outsideView.style.backgroundImage = `url('${station.outsideImage}')`;

  if (station.outsideAudio && station.outsideAudio.trim()) {
    playTrack(station.outsideAudio, true, 0.55);
  } else {
    stopAudio();
  }

  attachReturnButtons();
  await transitionTo(outsideView, { type: "default" });
}

// ========= MODAL HANDLING =========
const modal = document.getElementById("modal");
const modalConfirm = document.getElementById("modalConfirm");
const modalCancel = document.getElementById("modalCancel");

modalConfirm.addEventListener("click", async () => {
  modal.classList.remove("active");
  if (pendingAction) {
    if (pendingAction.type === "station") {
      await goToStation(pendingAction.data);
    } else if (pendingAction.type === "outside") {
      await goToOutside(pendingAction.data);
    }
    pendingAction = null;
  }
});

modalCancel.addEventListener("click", () => {
  modal.classList.remove("active");
  pendingAction = null;
});

// ========= ESCAPE KEY TO CLOSE MAP =========
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMap();
  }
});

// ========= INITIALIZE =========
function init() {
  buildAllStations();
  createMapOverlay();
  attachExitEvents();
  attachReturnButtons();

  // Start at central station
  const centralStation = stations.find((s) => s.id === "central");
  if (centralStation) {
    const centralView = document.getElementById(`station_central`);
    centralView.style.backgroundImage = `url('${centralStation.stationImage}')`;
    if (centralStation.stationAudio && centralStation.stationAudio.trim()) {
      playTrack(centralStation.stationAudio, true, 0.5);
    }
    centralView.classList.add("active-view");
    currentStationId = "central";
  }

  console.log("✅ All features added: dropdown, train animation, per-station tinting");
  console.log("📍 Your train1-5.png images are preserved");
}

init();