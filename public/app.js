const TRACK_LOAD_LIMIT = 2000;
const CANDIDATE_PREVIEW_LIMIT = 80;

const state = {
  connected: false,
  sourceMode: "search",
  candidates: [],
  deck: [],
  deckCursor: 0,
  history: [],
  current: null,
  currentIndex: -1,
  round: 0,
  correct: 0,
  wrong: 0,
  results: new Map(),
  revealed: false,
  setupPanelHidden: false,
  artworkRequestId: 0,
  currentArtworkUrl: null,
};

const el = {
  body: document.body,
  appShell: byId("appShell"),
  setupPanel: byId("setupPanel"),
  configStatus: byId("configStatus"),
  authorizeButton: byId("authorizeButton"),
  searchTerm: byId("searchTerm"),
  searchButton: byId("searchButton"),
  loadLibraryPlaylistsButton: byId("loadLibraryPlaylistsButton"),
  libraryPlaylistSelect: byId("libraryPlaylistSelect"),
  loadLibraryTracksButton: byId("loadLibraryTracksButton"),
  loadLibraryButton: byId("loadLibraryButton"),
  introSeconds: byId("introSeconds"),
  durationPresetButtons: [...document.querySelectorAll("[data-duration]")],
  artistLimit: byId("artistLimit"),
  buildDeckButton: byId("buildDeckButton"),
  candidateCount: byId("candidateCount"),
  deckCount: byId("deckCount"),
  candidateList: byId("candidateList"),
  roundCount: byId("roundCount"),
  correctCount: byId("correctCount"),
  wrongCount: byId("wrongCount"),
  artworkFrame: byId("artworkFrame"),
  artworkImage: byId("artworkImage"),
  coverPlaceholder: document.querySelector(".cover-placeholder"),
  questionLabel: byId("questionLabel"),
  maskedTitle: byId("maskedTitle"),
  maskedArtist: byId("maskedArtist"),
  answerInput: byId("answerInput"),
  checkAnswerButton: byId("checkAnswerButton"),
  judgeResult: byId("judgeResult"),
  previousButton: byId("previousButton"),
  nextButton: byId("nextButton"),
  showHintButton: byId("showHintButton"),
  revealButton: byId("revealButton"),
  markCorrectButton: byId("markCorrectButton"),
  markWrongButton: byId("markWrongButton"),
  hintBox: byId("hintBox"),
  logBox: byId("logBox"),
};

init();

async function init() {
  bindEvents();
  setButtonsEnabled(false);
  el.authorizeButton.disabled = true;
  setStatus("起動確認中", "");

  try {
    const health = await apiJson("/api/health");
    if (!health.ok) throw new Error("ローカルサーバーを確認できませんでした。");
    el.authorizeButton.disabled = false;
    setSourceButtonsEnabled(true);
    setStatus("接続待ち", "ready");
    log("準備完了。読込操作のときにMusic.appへ接続します。初回はmacOSのAutomation許可が出ます。");
  } catch (error) {
    setStatus("起動失敗", "error");
    logError(error);
  }
}

function bindEvents() {
  document.querySelectorAll("[data-source-mode]").forEach((button) => {
    button.addEventListener("click", () => setSourceMode(button.dataset.sourceMode));
  });

  el.authorizeButton.addEventListener("click", connectMusicApp);
  el.setupPanel.addEventListener("toggle", syncSetupPanel);
  el.searchButton.addEventListener("click", loadSearch);
  el.loadLibraryPlaylistsButton.addEventListener("click", loadLibraryPlaylists);
  el.loadLibraryTracksButton.addEventListener("click", loadLibraryTracks);
  el.loadLibraryButton.addEventListener("click", loadLibrary);
  el.libraryPlaylistSelect.addEventListener("change", () => {
    el.loadLibraryTracksButton.disabled = !state.connected || !el.libraryPlaylistSelect.value;
  });
  el.buildDeckButton.addEventListener("click", buildDeck);
  el.previousButton.addEventListener("click", previousQuestion);
  el.nextButton.addEventListener("click", nextQuestion);
  el.revealButton.addEventListener("click", revealAnswer);
  el.showHintButton.addEventListener("click", showHint);
  el.checkAnswerButton.addEventListener("click", checkAnswer);
  el.markCorrectButton.addEventListener("click", () => mark(true));
  el.markWrongButton.addEventListener("click", () => mark(false));
  el.durationPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      el.introSeconds.value = button.dataset.duration || "3";
      syncIntroDuration();
      playIntro(Number(button.dataset.duration), button);
    });
  });
  syncIntroDuration();
  syncSetupPanel();
}

async function connectMusicApp() {
  try {
    setStatus("接続中", "");
    const status = await apiJson("/api/music/status");
    state.connected = true;
    setButtonsEnabled(true);
    el.loadLibraryTracksButton.disabled = true;
    setStatus("接続済み", "ready");
    log(`${status.appName || "Music.app"} ${status.version || ""} に接続しました。`);
  } catch (error) {
    state.connected = false;
    setButtonsEnabled(false);
    setStatus("接続失敗", "error");
    logError(error);
  }
}

async function loadSearch() {
  const done = setBusy(el.searchButton, "検索中");
  try {
    const term = el.searchTerm.value.trim();
    if (!term) throw new Error("検索語を入力してください。");

    await ensureConnected();
    log(`Music.app内を検索中: ${term}`);
    const body = await apiJson(`/api/music/search?term=${encodeURIComponent(term)}&limit=80`);
    const tracks = body.tracks || [];
    setCandidates(tracks);
    if (!tracks.length) {
      log(`「${term}」の検索結果は0件でした。Music.appのライブラリに追加済みの曲だけが対象です。`);
    }
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibraryPlaylists() {
  const done = setBusy(el.loadLibraryPlaylistsButton, "取得中");
  try {
    await ensureConnected();
    log("Music.appのプレイリスト一覧を取得中");
    const body = await apiJson("/api/music/playlists");
    const playlists = body.playlists || [];
    el.libraryPlaylistSelect.innerHTML = "";

    if (!playlists.length) {
      el.libraryPlaylistSelect.append(new Option("プレイリストが見つかりません", ""));
      el.libraryPlaylistSelect.disabled = true;
      el.loadLibraryTracksButton.disabled = true;
      return;
    }

    for (const playlist of playlists) {
      const label = `${playlist.name} (${playlist.count})`;
      const option = new Option(label, playlist.id);
      option.dataset.count = String(playlist.count || 0);
      el.libraryPlaylistSelect.append(option);
    }
    selectPreferredPlaylist(playlists);
    el.libraryPlaylistSelect.disabled = false;
    el.loadLibraryTracksButton.disabled = !el.libraryPlaylistSelect.value;
    log(`${playlists.length}件のプレイリストを取得しました。`);
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibraryTracks() {
  const done = setBusy(el.loadLibraryTracksButton, "読込中");
  try {
    await ensureConnected();
    const playlistId = el.libraryPlaylistSelect.value;
    if (!playlistId) throw new Error("プレイリストを選択してください。");
    const selectedOption = el.libraryPlaylistSelect.selectedOptions[0];
    const playlistCount = Number(selectedOption?.dataset.count || 0);
    const limit = Math.min(playlistCount || TRACK_LOAD_LIMIT, TRACK_LOAD_LIMIT);

    log("プレイリストからランダムに曲を読み込み中");
    const body = await apiJson(`/api/music/tracks?playlistId=${encodeURIComponent(playlistId)}&limit=${limit}&shuffle=1`);
    setCandidates(body.tracks || []);
    if (playlistCount > TRACK_LOAD_LIMIT) {
      log(`プレイリストが大きいため、ランダムに${TRACK_LOAD_LIMIT}曲まで読み込みました。`);
    }
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibrary() {
  const done = setBusy(el.loadLibraryButton, "読込中");
  try {
    await ensureConnected();
    log("ライブラリからランダムに曲を読み込み中");
    const body = await apiJson(`/api/music/library?limit=${TRACK_LOAD_LIMIT}&shuffle=1`);
    setCandidates(body.tracks || []);
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

function setCandidates(resources) {
  state.candidates = normalizeTracks(resources);
  state.deck = [];
  state.deckCursor = 0;
  state.history = [];
  state.current = null;
  state.currentIndex = -1;
  state.round = 0;
  state.correct = 0;
  state.wrong = 0;
  state.results.clear();
  state.revealed = false;
  renderCandidates();
  renderCounts();
  renderCurrent();
  log(`${state.candidates.length}曲を候補にしました。`);
}

async function buildDeck() {
  try {
    if (!state.candidates.length) throw new Error("先に候補曲を読み込んでください。");
    const artistLimit = Number(el.artistLimit.value);
    const shuffled = shuffle([...state.candidates]);
    const artistCounts = new Map();
    const deck = [];

    for (const song of shuffled) {
      const key = normalizeText(song.artistName);
      const current = artistCounts.get(key) || 0;
      if (artistLimit > 0 && current >= artistLimit) continue;
      artistCounts.set(key, current + 1);
      deck.push(song);
    }

    state.deck = deck;
    state.deckCursor = 0;
    state.history = [];
    state.currentIndex = -1;
    state.round = 0;
    state.correct = 0;
    state.wrong = 0;
    state.results.clear();
    state.current = null;
    renderCounts();
    await nextQuestion();
    log(`${state.deck.length}曲の出題デッキを作りました。`);
  } catch (error) {
    logError(error);
  }
}

async function nextQuestion() {
  try {
    if (!state.deck.length) throw new Error("候補からデッキを作成してください。");
    await pausePlayback({ quiet: true });

    if (state.currentIndex >= 0 && state.currentIndex < state.history.length - 1) {
      showQuestionAt(state.currentIndex + 1);
      return;
    }

    if (state.deckCursor >= state.deck.length) {
      state.deck = shuffle([...state.deck]);
      state.deckCursor = 0;
      log("デッキを一周したのでシャッフルしました。");
    }

    const nextSong = state.deck[state.deckCursor];
    state.deckCursor += 1;
    state.history.push(nextSong);
    showQuestionAt(state.history.length - 1);
  } catch (error) {
    logError(error);
  }
}

async function previousQuestion() {
  try {
    if (!state.deck.length) throw new Error("候補からデッキを作成してください。");
    if (state.currentIndex <= 0) throw new Error("これが最初の問題です。");
    await pausePlayback({ quiet: true });
    showQuestionAt(state.currentIndex - 1);
  } catch (error) {
    logError(error);
  }
}

function showQuestionAt(index) {
  const song = state.history[index];
  if (!song) return;

  state.currentIndex = index;
  state.current = song;
  state.round = index + 1;
  state.revealed = getStoredResult(index) !== null;
  el.answerInput.value = "";
  el.hintBox.textContent = "";
  renderCounts();
  renderCurrent();
  renderStoredJudgeResult();
}

async function playIntro(seconds = Number(el.introSeconds.value), triggerButton = null) {
  const done = triggerButton ? setBusy(triggerButton, "...") : () => {};
  try {
    if (!state.current) throw new Error("問題を開始してください。");
    await ensureConnected();

    await apiJson("/api/music/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playlistId: state.current.playlistId,
        trackId: state.current.id,
        seconds,
      }),
    });
    log(`${seconds}秒だけMusic.appで再生しています。`);
  } catch (error) {
    logError(error);
  } finally {
    done();
    syncIntroDuration();
  }
}

async function pausePlayback(options = {}) {
  try {
    await apiJson("/api/music/pause", { method: "POST" });
    if (!options.quiet) log("Music.appを停止しました。");
  } catch (error) {
    if (!options.quiet) logError(error);
  }
}

function checkAnswer() {
  try {
    if (!state.current) throw new Error("問題を開始してください。");
    const answer = el.answerInput.value.trim();
    if (!answer) throw new Error("回答を入力してください。");

    const expected = normalizeText(state.current.name);
    const actual = normalizeText(answer);
    const distance = levenshtein(expected, actual);
    const score = 1 - distance / Math.max(expected.length, actual.length, 1);

    if (actual === expected || score >= 0.82) {
      el.judgeResult.textContent = "正解！";
      el.judgeResult.className = "judge-result is-ok";
      mark(true, { reveal: true, quiet: true });
    } else {
      el.judgeResult.textContent = `惜しいかも。正解は「${state.current.name}」`;
      el.judgeResult.className = "judge-result is-ng";
    }
  } catch (error) {
    logError(error);
  }
}

function showHint() {
  try {
    if (!state.current) throw new Error("問題を開始してください。");
    const song = state.current;
    const hints = [
      `曲名: ${maskText(song.name)}`,
      `アーティスト: ${song.artistName.charAt(0) || "?"}...`,
    ];
    if (song.albumName) hints.push(`アルバム: ${song.albumName}`);
    if (song.year) hints.push(`年: ${song.year}`);
    if (song.duration) hints.push(`長さ: ${formatDuration(song.duration)}`);
    el.hintBox.textContent = hints.join(" / ");
  } catch (error) {
    logError(error);
  }
}

function revealAnswer() {
  try {
    if (!state.current) throw new Error("問題を開始してください。");
    state.revealed = !state.revealed;
    renderCurrent();
  } catch (error) {
    logError(error);
  }
}

function mark(isCorrect, options = {}) {
  if (!state.current || state.currentIndex < 0) return;
  const wasCorrect = getStoredResult() === true;
  state.results.set(state.currentIndex, isCorrect);
  syncScoreCounts();
  if (options.reveal !== false) {
    state.revealed = true;
    renderCurrent();
  }
  renderCounts();
  if (!options.quiet) {
    el.judgeResult.textContent = isCorrect ? "正解として記録しました。" : "不正解として記録しました。";
    el.judgeResult.className = `judge-result ${isCorrect ? "is-ok" : "is-ng"}`;
  }
  if (isCorrect && !wasCorrect) {
    playHighlight(state.current).catch(logError);
  }
}

function getStoredResult(index = state.currentIndex) {
  return state.results.has(index) ? state.results.get(index) : null;
}

function syncScoreCounts() {
  state.correct = 0;
  state.wrong = 0;
  for (const result of state.results.values()) {
    if (result) state.correct += 1;
    else state.wrong += 1;
  }
}

function renderStoredJudgeResult() {
  const result = getStoredResult();
  if (result === true) {
    el.judgeResult.textContent = "正解として記録済み。";
    el.judgeResult.className = "judge-result is-ok";
    return;
  }
  if (result === false) {
    el.judgeResult.textContent = "不正解として記録済み。";
    el.judgeResult.className = "judge-result is-ng";
    return;
  }
  el.judgeResult.textContent = "";
  el.judgeResult.className = "judge-result";
}

function renderCurrent() {
  const song = state.current;
  const hasSong = Boolean(song);
  const revealed = hasSong && state.revealed;

  el.questionLabel.textContent = hasSong ? `第${state.round}問` : "候補を読み込んで開始";
  el.maskedTitle.textContent = !hasSong ? "---" : revealed ? song.name : "????";
  el.maskedArtist.textContent = !hasSong
    ? "Music.appのライブラリから出題します"
    : revealed
      ? song.artistName
      : "アーティスト非表示";
  el.revealButton.textContent = revealed ? "隠す" : "答え";
  el.revealButton.setAttribute("aria-label", revealed ? "答えを隠す" : "答えを表示");
  el.revealButton.setAttribute("aria-pressed", String(revealed));

  el.artworkFrame.classList.toggle("is-revealed", false);
  clearArtworkImage();
  el.coverPlaceholder.textContent = revealed ? "♪" : "?";
  if (revealed) {
    loadArtwork(song, state.artworkRequestId).catch(logError);
  }
  syncCorrectMode();
  syncQuestionControls();
}

function clearArtworkImage() {
  state.artworkRequestId += 1;
  if (state.currentArtworkUrl) {
    URL.revokeObjectURL(state.currentArtworkUrl);
    state.currentArtworkUrl = null;
  }
  el.artworkImage.src = "";
  el.artworkImage.alt = "";
}

async function loadArtwork(song, requestId) {
  if (!song) return;
  const params = new URLSearchParams({
    playlistId: song.playlistId || "__library__",
    trackId: song.id,
  });
  const response = await fetch(`/api/music/artwork?${params.toString()}`);
  if (requestId !== state.artworkRequestId) return;
  if (response.status === 404) return;
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || response.statusText || "Artwork error");
  }

  const blob = await response.blob();
  if (requestId !== state.artworkRequestId || !state.revealed || state.current?.id !== song.id) return;
  if (!blob.size) return;

  const imageUrl = URL.createObjectURL(blob);
  if (state.currentArtworkUrl) URL.revokeObjectURL(state.currentArtworkUrl);
  state.currentArtworkUrl = imageUrl;
  el.artworkImage.src = imageUrl;
  el.artworkImage.alt = `${song.name} のアルバムアート`;
  el.artworkFrame.classList.add("is-revealed");

  const colors = await extractColors(imageUrl).catch(() => null);
  if (requestId === state.artworkRequestId && colors?.length) {
    applyArtworkColors(colors);
  }
}

function syncCorrectMode() {
  const isCorrect = Boolean(state.current && state.revealed && getStoredResult() === true);
  el.body.classList.toggle("is-correct", isCorrect);
  el.nextButton.classList.toggle("next-reveal-button", isCorrect);
  el.nextButton.textContent = isCorrect ? "次の問題へ" : "→";
  el.nextButton.setAttribute("aria-label", isCorrect ? "次の問題へ" : "次の問題");
  if (!isCorrect) resetArtworkColors();
}

async function playHighlight(song) {
  if (!song) return;
  await ensureConnected();
  const position = calculateHighlightPosition(song.duration);
  await apiJson("/api/music/play-highlight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playlistId: song.playlistId,
      trackId: song.id,
      position,
    }),
  });
  log(`${Math.round(position)}秒付近から再生しています。`);
}

function calculateHighlightPosition(duration) {
  const total = Number(duration || 0);
  if (!Number.isFinite(total) || total <= 0) return 45;
  const safeEnd = Math.max(0, total - 8);
  const quarter = total / 4;
  if (quarter >= 45) return Math.min(quarter, safeEnd);
  const landing = Math.min(60, Math.max(45, total * 0.45));
  return Math.min(landing, safeEnd);
}

function applyArtworkColors(colors) {
  const [primary, secondary] = colors;
  document.documentElement.style.setProperty("--apple-bg-1", primary || "#3d625f");
  document.documentElement.style.setProperty("--apple-bg-2", secondary || primary || "#1c1c1a");
}

function resetArtworkColors() {
  document.documentElement.style.setProperty("--apple-bg-1", "#3d625f");
  document.documentElement.style.setProperty("--apple-bg-2", "#1c1c1a");
}

function extractColors(src) {
  return new Promise((resolvePromise, rejectPromise) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      try {
        const size = 48;
        const ratio = image.naturalHeight / Math.max(image.naturalWidth, 1);
        const width = size;
        const height = Math.max(1, Math.round(size * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0, width, height);
        const pixels = context.getImageData(0, 0, width, height).data;
        const buckets = new Map();

        for (let index = 0; index < pixels.length; index += 16) {
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];
          if (a < 180) continue;
          if (r > 238 && g > 238 && b > 238) continue;
          if (r < 18 && g < 18 && b < 18) continue;
          const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
          const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0 };
          bucket.r += r;
          bucket.g += g;
          bucket.b += b;
          bucket.count += 1;
          buckets.set(key, bucket);
        }

        const ranked = [...buckets.values()]
          .map((bucket) => ({
            r: Math.round(bucket.r / bucket.count),
            g: Math.round(bucket.g / bucket.count),
            b: Math.round(bucket.b / bucket.count),
            count: bucket.count,
          }))
          .sort((a, b) => b.count - a.count);

        const selected = [];
        for (const color of ranked) {
          if (selected.every((picked) => colorDistance(picked, color) > 70)) {
            selected.push(color);
          }
          if (selected.length >= 3) break;
        }

        if (!selected.length) {
          resolvePromise(["#3d625f", "#1c1c1a"]);
          return;
        }

        resolvePromise(selected.map(toCssColor));
      } catch (error) {
        rejectPromise(error);
      }
    };
    image.onerror = () => rejectPromise(new Error("Artwork color extraction failed."));
    image.src = src;
  });
}

function colorDistance(a, b) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function toCssColor(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function renderCounts() {
  el.candidateCount.textContent = String(state.candidates.length);
  el.deckCount.textContent = String(state.deck.length);
  el.roundCount.textContent = String(state.round);
  el.correctCount.textContent = String(state.correct);
  el.wrongCount.textContent = String(state.wrong);
  syncQuestionControls();
}

function renderCandidates() {
  el.candidateList.innerHTML = "";
  const previewSongs = state.candidates.slice(0, CANDIDATE_PREVIEW_LIMIT);
  for (const song of previewSongs) {
    const item = document.createElement("div");
    item.className = "candidate-item";

    const icon = document.createElement("div");
    icon.className = "candidate-icon";
    icon.textContent = "♪";

    const text = document.createElement("div");
    const title = document.createElement("strong");
    const artist = document.createElement("span");
    title.textContent = song.name;
    artist.textContent = [song.artistName, song.albumName].filter(Boolean).join(" / ");
    text.append(title, artist);

    item.append(icon, text);
    el.candidateList.append(item);
  }
  if (state.candidates.length > CANDIDATE_PREVIEW_LIMIT) {
    const item = document.createElement("div");
    item.className = "candidate-item candidate-more";

    const icon = document.createElement("div");
    icon.className = "candidate-icon";
    icon.textContent = "+";

    const text = document.createElement("div");
    const title = document.createElement("strong");
    const count = state.candidates.length - CANDIDATE_PREVIEW_LIMIT;
    title.textContent = `ほか${count}曲`;
    text.append(title);

    item.append(icon, text);
    el.candidateList.append(item);
  }
}

function setSourceMode(mode) {
  state.sourceMode = mode;
  document.querySelectorAll("[data-source-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sourceMode === mode);
  });
  byId("searchSource").classList.toggle("is-hidden", mode !== "search");
  byId("playlistSource").classList.toggle("is-hidden", mode !== "playlist");
  byId("librarySource").classList.toggle("is-hidden", mode !== "library");
}

function selectPreferredPlaylist(playlists) {
  const preferred =
    playlists.find((playlist) => playlist.name === "イントロドン") ||
    playlists.find((playlist) => /イントロ|intro/i.test(playlist.name)) ||
    playlists.find((playlist) => playlist.count > 0 && playlist.count <= 200) ||
    playlists.find((playlist) => playlist.count > 0);

  if (!preferred) return;
  el.libraryPlaylistSelect.value = preferred.id;
  log(`おすすめとして「${preferred.name}」を選択しました。`);
}

function syncIntroDuration() {
  const seconds = Number(el.introSeconds.value);
  el.durationPresetButtons.forEach((button) => {
    const isActive = Number(button.dataset.duration) === seconds;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function syncSetupPanel() {
  state.setupPanelHidden = !el.setupPanel.open;
  el.appShell.classList.toggle("is-setup-hidden", state.setupPanelHidden);
}

async function apiJson(path, options = {}) {
  const response = await fetch(path, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || response.statusText || "API error");
  }
  return body;
}

function normalizeTracks(resources) {
  const seen = new Set();
  const songs = [];

  for (const resource of resources) {
    const id = String(resource.id || "");
    const playlistId = String(resource.playlistId || "__library__");
    const key = `${playlistId}:${id}`;
    if (!id || seen.has(key)) continue;
    seen.add(key);

    songs.push({
      id,
      playlistId,
      name: resource.name || "Unknown Title",
      artistName: resource.artistName || "Unknown Artist",
      albumName: resource.albumName || "",
      duration: Number(resource.duration || 0),
      year: Number(resource.year || 0),
    });
  }

  return songs;
}

function setButtonsEnabled(enabled) {
  [
    el.searchButton,
    el.loadLibraryPlaylistsButton,
    el.loadLibraryTracksButton,
    el.loadLibraryButton,
    el.buildDeckButton,
  ].forEach((button) => {
    button.disabled = !enabled;
  });
  syncQuestionControls();
}

function setSourceButtonsEnabled(enabled) {
  [el.searchButton, el.loadLibraryPlaylistsButton, el.loadLibraryButton].forEach((button) => {
    button.disabled = !enabled;
  });
}

function syncQuestionNavigation() {
  const canGoBack = state.currentIndex > 0;
  const canGoForward = state.deck.length > 0 || state.currentIndex < state.history.length - 1;
  el.previousButton.disabled = !canGoBack;
  el.nextButton.disabled = !canGoForward;
}

function syncQuestionControls() {
  const hasCurrent = Boolean(state.current);
  el.durationPresetButtons.forEach((button) => {
    button.disabled = !hasCurrent;
  });
  [el.showHintButton, el.revealButton, el.markCorrectButton, el.markWrongButton, el.checkAnswerButton].forEach((button) => {
    button.disabled = !hasCurrent;
  });
  el.answerInput.disabled = !hasCurrent;
  syncQuestionNavigation();
}

function setBusy(button, label) {
  const previousText = button.textContent;
  const wasDisabled = button.disabled;
  button.textContent = label;
  button.disabled = true;
  return () => {
    button.textContent = previousText;
    button.disabled = wasDisabled;
  };
}

async function ensureConnected() {
  if (state.connected) return;
  await connectMusicApp();
  if (!state.connected) {
    throw new Error("Music.appに接続できませんでした。");
  }
}

function setStatus(text, variant) {
  el.configStatus.textContent = text;
  el.configStatus.className = "status-pill";
  if (variant === "ready") el.configStatus.classList.add("is-ready");
  if (variant === "error") el.configStatus.classList.add("is-error");
}

function log(message) {
  const time = new Date().toLocaleTimeString("ja-JP", { hour12: false });
  el.logBox.textContent = `[${time}] ${message}\n${el.logBox.textContent}`.slice(0, 5000);
}

function logError(error) {
  const message = error instanceof Error ? error.message : String(error);
  log(`ERROR: ${message}`);
}

function maskText(text) {
  return [...text]
    .map((char, index) => {
      if (char.trim() === "") return " ";
      return index === 0 ? char : "○";
    })
    .join("");
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~、。・「」『』【】（）［］\s-]/g, "");
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function formatDuration(seconds) {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

function byId(id) {
  return document.getElementById(id);
}
