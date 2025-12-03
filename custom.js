function setupRealtimeValidation() {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput  = document.getElementById("lastName");
  const emailInput     = document.getElementById("email");
  const addressInput   = document.getElementById("address");

  if (firstNameInput) {
    firstNameInput.addEventListener("input", () => validateName(firstNameInput, "Vardas"));
    firstNameInput.addEventListener("blur",  () => validateName(firstNameInput, "Vardas"));
  }

  if (lastNameInput) {
    lastNameInput.addEventListener("input", () => validateName(lastNameInput, "Pavardė"));
    lastNameInput.addEventListener("blur",  () => validateName(lastNameInput, "Pavardė"));
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => validateEmail(emailInput));
    emailInput.addEventListener("blur",  () => validateEmail(emailInput));
  }

  if (addressInput) {
    addressInput.addEventListener("input", () => validateAddress(addressInput));
    addressInput.addEventListener("blur",  () => validateAddress(addressInput));
  }
    const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", handlePhoneInput);
  }

}

function validateName(input, labelText) {
  const value = input.value.trim();

  if (!value) {
    showError(input, labelText + " privalomas");
    return false;
  }

  const nameRegex = /^[A-Za-zĀČĖĘĮŠŲŪŽāčėęįšųūžÀ-ž\s'-]+$/;

  if (!nameRegex.test(value)) {
    showError(input, labelText + " turi būti sudarytas tik iš raidžių");
    return false;
  }

  clearError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, "El. paštas privalomas");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    showError(input, "Įveskite teisingą el. pašto adresą");
    return false;
  }

  clearError(input);
  return true;
}

function validateAddress(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, "Adresas privalomas");
    return false;
  }

  const onlyDigits = /^\d+$/;
  if (onlyDigits.test(value)) {
    showError(input, "Adresas turi būti tekstas, ne tik skaičiai");
    return false;
  }

  clearError(input);
  return true;
}
function handlePhoneInput(event) {
  const input = event.target;


  let digits = input.value.replace(/\D/g, "");


  if (digits.startsWith("370")) {
    digits = digits.slice(3);
  }

  if (digits.length > 8) {
    digits = digits.slice(0, 8);
  }

  if (digits.length === 0) {
    input.value = "";
    return;
  }

  const firstPart = digits.slice(0, 3);
  const secondPart = digits.slice(3);

  let formatted = "+370 " + firstPart;
  if (secondPart) {
    formatted += " " + secondPart;
  }

  input.value = formatted;
}


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const formOutput = document.getElementById("form-output");

  initRangeLabels();
  setupRealtimeValidation();

  if (!form) {
    console.error("Nerasta forma su id='contact-form'");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

       const firstNameInput = document.getElementById("firstName");
    const lastNameInput  = document.getElementById("lastName");
    const emailInput     = document.getElementById("email");
    const phoneInput     = document.getElementById("phone");
    const addressInput   = document.getElementById("address");

    const firstName = firstNameInput.value.trim();
    const lastName  = lastNameInput.value.trim();
    const email     = emailInput.value.trim();
    const phone     = phoneInput.value.trim();
    const address   = addressInput.value.trim();

    const q1 = Number(document.getElementById("q1").value);
    const q2 = Number(document.getElementById("q2").value);
    const q3 = Number(document.getElementById("q3").value);

    let isValid = true;

    if (!validateName(firstNameInput, "Vardas"))  isValid = false;
    if (!validateName(lastNameInput, "Pavardė"))  isValid = false;
    if (!validateEmail(emailInput))               isValid = false;
    if (!validateAddress(addressInput))           isValid = false;

    const phonePattern = /^\+370\s6\d{2}\s\d{5}$/;

    if (!phonePattern.test(phone)) {
      showError(phoneInput, "Telefono numeris turi būti formatu +370 6xx xxxxx");
      isValid = false;
    } else {
      clearError(phoneInput);
    }


    if (!isValid) {
      formMessage.textContent = "Pataisykite klaidas formoje.";
      formMessage.style.color = "red";
      return;
    }

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      ratings: {
        design: Number(q1),
        content: Number(q2),
        usability: Number(q3)
      }
    };
    const average = (Number(q1) + Number(q2) + Number(q3)) / 3;
    const averageFormatted = average.toFixed(1);

    console.log("Formos duomenų objektas:", formData);

    if (formOutput) {
      formOutput.innerHTML = `
        <p>Vardas: ${formData.firstName}</p>
        <p>Pavardė: ${formData.lastName}</p>
        <p>El. paštas: ${formData.email}</p>
        <p>Tel. numeris: ${formData.phone}</p>
        <p>Adresas: ${formData.address || "-"}</p>
        <p>CV dizaino įvertinimas: ${formData.ratings.design}/10</p>
        <p>Turinio aiškumo įvertinimas: ${formData.ratings.content}/10</p>
        <p>Naudojimo patogumo įvertinimas: ${formData.ratings.usability}/10</p>
      `;
      formOutput.innerHTML += `
        <hr>
        <p><strong>${formData.firstName} ${formData.lastName}:</strong> ${averageFormatted}</p>
      `;
      formMessage.textContent = "Forma sėkmingai apdorota. Duomenys parodyti žemiau.";
      formMessage.style.color = "lime";

      showSuccessPopup();

    }
  });
});

function initRangeLabels() {
  const items = [
    { inputId: "q1", labelId: "q1-value" },
    { inputId: "q2", labelId: "q2-value" },
    { inputId: "q3", labelId: "q3-value" }
  ];

  items.forEach(item => {
    const input = document.getElementById(item.inputId);
    const label = document.getElementById(item.labelId);

    if (!input || !label) return;

    label.textContent = input.value;

    input.addEventListener("input", function () {
      label.textContent = input.value;
    });
  });
}

////////////////////////
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  const closeBtn = document.getElementById("success-popup-close");

  if (!popup) return;
  popup.classList.add("visible");

  if (closeBtn) {
    closeBtn.onclick = function () {
      popup.classList.remove("visible");
    };
  }

  setTimeout(function () {
    popup.classList.remove("visible");
  }, 3000);
}

function showError(input, message) {
  input.classList.add("input-error");

  let errorSpan = input.parentElement.querySelector(".error-message");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    input.parentElement.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

function clearError(input) {
  input.classList.remove("input-error");
  const errorSpan = input.parentElement.querySelector(".error-message");
  if (errorSpan) {
    errorSpan.textContent = "";
  }
}

// =================== ATMINTIES KORTELIŲ ŽAIDIMAS ===================
const memorySymbols = [
  { icon: "bi bi-cpu",           label: "CPU" },
  { icon: "bi bi-robot",         label: "Robotika" },
  { icon: "bi bi-lightning",     label: "Automatika" },
  { icon: "bi bi-broadcast-pin", label: "Jutikliai" },
  { icon: "bi bi-diagram-3",     label: "Sistemos" },
  { icon: "bi bi-motherboard",   label: "Elektronika" },
  { icon: "bi bi-code-slash",    label: "Programavimas" },
  { icon: "bi bi-speedometer2",  label: "Valdymas" },
  { icon: "bi bi-cloud",         label: "Debesija" },
  { icon: "bi bi-hdd-network",   label: "Tinklai" },
  { icon: "bi bi-gear",          label: "Mechanika" },
  { icon: "bi bi-graph-up",      label: "Analizė" }
];

const BEST_SCORE_KEYS = {
  easy: "memoryBest_easy",
  hard: "memoryBest_hard"
};

const memoryGameState = {
  difficulty: "easy",
  firstCard: null,
  secondCard: null,
  boardLocked: false,
  moves: 0,
  matches: 0,
  totalPairs: 0,
  timerIntervalId: null,
  elapsedSeconds: 0,
  timerRunning: false,
  bestScores: {
    easy: null,
    hard: null
  }
};

function getSymbolsForDifficulty(difficulty) {
  if (difficulty === "hard") {
    return memorySymbols.slice(0, 12);
  }
  return memorySymbols.slice(0, 6);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

function updateTimeDisplay() {
  const timeEl = document.getElementById("game-time");
  if (!timeEl) return;
  timeEl.textContent = formatTime(memoryGameState.elapsedSeconds);
}

function resetTimer() {
  if (memoryGameState.timerIntervalId) {
    clearInterval(memoryGameState.timerIntervalId);
  }
  memoryGameState.timerIntervalId = null;
  memoryGameState.elapsedSeconds = 0;
  memoryGameState.timerRunning = false;
  updateTimeDisplay();
}

function startTimer() {
  if (memoryGameState.timerRunning) return;
  memoryGameState.timerRunning = true;
  memoryGameState.timerIntervalId = setInterval(() => {
    memoryGameState.elapsedSeconds++;
    updateTimeDisplay();
  }, 1000);
}

function stopTimer() {
  if (memoryGameState.timerIntervalId) {
    clearInterval(memoryGameState.timerIntervalId);
  }
  memoryGameState.timerIntervalId = null;
  memoryGameState.timerRunning = false;
}

function loadBestScoresFromStorage() {
  try {
    const easy = localStorage.getItem(BEST_SCORE_KEYS.easy);
    const hard = localStorage.getItem(BEST_SCORE_KEYS.hard);

    memoryGameState.bestScores.easy = easy ? parseInt(easy, 10) : null;
    memoryGameState.bestScores.hard = hard ? parseInt(hard, 10) : null;

    updateBestScoreDisplay();
  } catch (e) {
    console.warn("localStorage nepasiekiamas:", e);
  }
}

function updateBestScoreDisplay() {
  const bestEasyEl = document.getElementById("best-easy");
  const bestHardEl = document.getElementById("best-hard");

  if (bestEasyEl) {
    bestEasyEl.textContent =
      memoryGameState.bestScores.easy != null
        ? `${memoryGameState.bestScores.easy} ėjimai`
        : "–";
  }

  if (bestHardEl) {
    bestHardEl.textContent =
      memoryGameState.bestScores.hard != null
        ? `${memoryGameState.bestScores.hard} ėjimai`
        : "–";
  }
}

function updateBestScoreIfNeeded() {
  const diff = memoryGameState.difficulty;
  const currentMoves = memoryGameState.moves;
  const currentBest = memoryGameState.bestScores[diff];

  if (currentBest == null || currentMoves < currentBest) {
    memoryGameState.bestScores[diff] = currentMoves;

    try {
      localStorage.setItem(
        BEST_SCORE_KEYS[diff],
        String(currentMoves)
      );
    } catch (e) {
      console.warn("Nepavyko įrašyti į localStorage:", e);
    }

    updateBestScoreDisplay();
  }
}

function buildGameBoard() {
  const board = document.getElementById("game-board");
  const movesEl = document.getElementById("game-moves");
  const matchesEl = document.getElementById("game-matches");
  const totalPairsEl = document.getElementById("game-total-pairs");
  const messageEl = document.getElementById("game-message");

  if (!board || !movesEl || !matchesEl || !totalPairsEl) return;

  const symbolsForGame = getSymbolsForDifficulty(memoryGameState.difficulty);

  let cardsData = [];
  symbolsForGame.forEach((symbol, index) => {
    cardsData.push({ symbolIndex: index });
    cardsData.push({ symbolIndex: index });
  });

  cardsData = shuffleArray(cardsData);

  memoryGameState.totalPairs = symbolsForGame.length;
  memoryGameState.matches = 0;
  memoryGameState.moves = 0;
  memoryGameState.firstCard = null;
  memoryGameState.secondCard = null;
  memoryGameState.boardLocked = false;

  resetTimer();

  movesEl.textContent = "0";
  matchesEl.textContent = "0";
  totalPairsEl.textContent = String(memoryGameState.totalPairs);

  board.innerHTML = "";

  board.classList.remove("easy", "hard");
  board.classList.add(memoryGameState.difficulty === "hard" ? "hard" : "easy");

  if (messageEl) {
    messageEl.textContent = "";
    messageEl.classList.remove("visible");
  }

  cardsData.forEach(cardData => {
    const symbolIndex = cardData.symbolIndex;
    const symbol = symbolsForGame[symbolIndex];

    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("memory-card");
    card.dataset.symbolIndex = String(symbolIndex);

    const inner = document.createElement("div");
    inner.classList.add("memory-card-inner");

    const front = document.createElement("div");
    front.classList.add("memory-card-face", "memory-card-front");
    front.innerHTML = `<span class="card-question">?</span>`;

    const back = document.createElement("div");
    back.classList.add("memory-card-face", "memory-card-back");

    const iconEl = document.createElement("i");
    iconEl.className = symbol.icon;

    const labelEl = document.createElement("span");
    labelEl.textContent = symbol.label;

    back.appendChild(iconEl);
    back.appendChild(labelEl);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", handleCardClick);

    board.appendChild(card);
  });
}

function handleCardClick(event) {
  const card = event.currentTarget;

  if (
    memoryGameState.boardLocked ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");

  if (!memoryGameState.firstCard) {
    memoryGameState.firstCard = card;
    return;
  }

  memoryGameState.secondCard = card;
  memoryGameState.boardLocked = true;

  memoryGameState.moves++;
  updateGameStats();

  const firstSymbol = memoryGameState.firstCard.dataset.symbolIndex;
  const secondSymbol = memoryGameState.secondCard.dataset.symbolIndex;

  if (firstSymbol === secondSymbol) {
    handleMatch();
  } else {
    handleNoMatch();
  }
}

function updateGameStats() {
  const movesEl = document.getElementById("game-moves");
  const matchesEl = document.getElementById("game-matches");

  if (movesEl) {
    movesEl.textContent = String(memoryGameState.moves);
  }
  if (matchesEl) {
    matchesEl.textContent = String(memoryGameState.matches);
  }
}

function resetTurn() {
  memoryGameState.firstCard = null;
  memoryGameState.secondCard = null;
  memoryGameState.boardLocked = false;
}

function handleMatch() {
  const messageEl = document.getElementById("game-message");

  memoryGameState.firstCard.classList.add("matched");
  memoryGameState.secondCard.classList.add("matched");
  memoryGameState.matches++;

  updateGameStats();
  resetTurn();

  if (memoryGameState.matches === memoryGameState.totalPairs) {
    if (messageEl) {
      messageEl.textContent = "Laimėjote! Visos poros surastos 🎉";
      messageEl.classList.add("visible");
    }
    stopTimer();
    updateBestScoreIfNeeded();
  }
}

function handleNoMatch() {
  setTimeout(() => {
    memoryGameState.firstCard.classList.remove("flipped");
    memoryGameState.secondCard.classList.remove("flipped");
    resetTurn();
  }, 1000);
}

function getSelectedDifficulty() {
  const selected = document.querySelector('input[name="difficulty"]:checked');
  if (!selected) return "easy";
  return selected.value === "hard" ? "hard" : "easy";
}

function initMemoryGameControls() {
  const startBtn = document.getElementById("game-start");
  const resetBtn = document.getElementById("game-reset");
  const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');

  if (startBtn) {
    startBtn.addEventListener("click", function () {
      memoryGameState.difficulty = getSelectedDifficulty();
      buildGameBoard();
      startTimer();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      memoryGameState.difficulty = getSelectedDifficulty();
      buildGameBoard();
    });
  }

  difficultyInputs.forEach(input => {
    input.addEventListener("change", function () {
      memoryGameState.difficulty = getSelectedDifficulty();
      buildGameBoard();
    });
  });

  loadBestScoresFromStorage();
  memoryGameState.difficulty = getSelectedDifficulty();
  buildGameBoard();
}

document.addEventListener("DOMContentLoaded", function () {
  initMemoryGameControls();
});