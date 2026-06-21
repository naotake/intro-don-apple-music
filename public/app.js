const TRACK_LOAD_LIMIT = 2000;
const CANDIDATE_PREVIEW_LIMIT = 80;

const I18N = {
  ja: {
    "meta.title": "イントロドン for Music.app",
    "app.name": "イントロドン",
    "language.label": "言語",
    "score.round": "問目",
    "score.correct": "正解",
    "score.wrong": "不正解",
    "playback.label": "再生",
    "playback.suffix": "秒だけ聞く",
    "playback.aria": "イントロ再生",
    "playback.secondAria": "1秒再生",
    "playback.secondsAria": "{{seconds}}秒再生",
    "answer.label": "曲名を入力",
    "answer.check": "判定",
    "action.previous": "前の問題",
    "action.next": "次の問題",
    "action.hint": "ヒント",
    "action.markCorrect": "正解にする",
    "action.markWrong": "不正解にする",
    "action.showAnswer": "答えを表示",
    "action.hideAnswer": "答えを隠す",
    "action.answer": "答え",
    "action.hide": "隠す",
    "action.nextQuestion": "次の問題へ",
    "setup.label": "準備",
    "setup.connect": "Music.appに接続",
    "status.booting": "起動確認中",
    "status.waiting": "接続待ち",
    "status.startFailed": "起動失敗",
    "status.connecting": "接続中",
    "status.connected": "接続済み",
    "status.connectFailed": "接続失敗",
    "source.title": "出題ソース",
    "source.search": "検索",
    "source.playlist": "プレイリスト",
    "source.library": "ライブラリ",
    "source.searchLabel": "Music.app内検索",
    "source.searchPlaceholder": "曲名・アーティスト名",
    "source.load": "読込",
    "source.loadPlaylists": "プレイリスト読込",
    "source.notLoaded": "未読込",
    "source.loadTracks": "曲を読込",
    "source.loadLibrary": "ライブラリから読込",
    "source.noPlaylists": "プレイリストが見つかりません",
    "source.selectPlaylist": "プレイリストを選択",
    "settings.title": "ゲーム設定",
    "settings.artistLimit": "同一アーティスト上限",
    "settings.oneTrack": "1曲まで",
    "settings.twoTracks": "2曲まで",
    "settings.noLimit": "制限なし",
    "settings.buildDeck": "候補からデッキ作成",
    "candidates.title": "候補",
    "candidates.loaded": "候補曲",
    "candidates.deck": "出題曲",
    "busy.searching": "検索中",
    "busy.fetching": "取得中",
    "busy.loading": "読込中",
    "message.ready": "準備完了。読込操作のときにMusic.appへ接続します。初回はmacOSのAutomation許可が出ます。",
    "message.connected": "{{app}} {{version}} に接続しました。",
    "message.searching": "Music.app内を検索中: {{term}}",
    "message.searchEmpty": "「{{term}}」の検索結果は0件でした。Music.appのライブラリに追加済みの曲だけが対象です。",
    "message.playlistsLoading": "Music.appのプレイリスト一覧を取得中",
    "message.playlistsLoaded": "{{count}}件のプレイリストを取得しました。",
    "message.playlistLoading": "プレイリストからランダムに曲を読み込み中",
    "message.playlistLimited": "プレイリストが大きいため、ランダムに{{count}}曲まで読み込みました。",
    "message.libraryLoading": "ライブラリからランダムに曲を読み込み中",
    "message.candidatesLoaded": "{{count}}曲を候補にしました。",
    "message.deckBuilt": "{{count}}曲の出題デッキを作りました。",
    "message.deckReshuffled": "デッキを一周したのでシャッフルしました。",
    "message.introPlaying": "{{seconds}}秒だけMusic.appで再生しています。",
    "message.paused": "Music.appを停止しました。",
    "message.correct": "正解！",
    "message.almost": "惜しいかも。正解は「{{title}}」",
    "message.markedCorrect": "正解として記録しました。",
    "message.markedWrong": "不正解として記録しました。",
    "message.alreadyCorrect": "正解として記録済み。",
    "message.alreadyWrong": "不正解として記録済み。",
    "message.highlight": "{{seconds}}秒付近から再生しています。",
    "message.moreTracks": "ほか{{count}}曲",
    "message.preferredPlaylist": "おすすめとして「{{name}}」を選択しました。",
    "question.start": "候補を読み込んで開始",
    "question.round": "第{{round}}問",
    "question.subtitle": "Music.appのライブラリから出題します",
    "question.artistHidden": "アーティスト非表示",
    "question.artworkAlt": "{{title}} のアルバムアート",
    "hint.title": "曲名: {{value}}",
    "hint.artist": "アーティスト: {{value}}...",
    "hint.album": "アルバム: {{value}}",
    "hint.year": "年: {{value}}",
    "hint.duration": "長さ: {{value}}",
    "error.serverUnavailable": "ローカルサーバーを確認できませんでした。",
    "error.searchRequired": "検索語を入力してください。",
    "error.playlistRequired": "プレイリストを選択してください。",
    "error.loadCandidates": "先に候補曲を読み込んでください。",
    "error.buildDeck": "候補からデッキを作成してください。",
    "error.firstQuestion": "これが最初の問題です。",
    "error.startQuestion": "問題を開始してください。",
    "error.answerRequired": "回答を入力してください。",
    "error.connectFailed": "Music.appに接続できませんでした。",
    "error.automation": "macOSのAutomation許可が必要です。表示された確認で、このアプリからMusic.appの操作を許可してください。",
    "error.musicUnavailable": "Music.appを操作できませんでした。Music.appを起動して、Apple Musicにログイン済みか確認してください。",
  },
  en: {
    "meta.title": "Intro Don for Music.app",
    "app.name": "Intro Don",
    "language.label": "Language",
    "score.round": "Question",
    "score.correct": "Correct",
    "score.wrong": "Incorrect",
    "playback.label": "Play intro",
    "playback.suffix": "seconds",
    "playback.aria": "Play the intro",
    "playback.secondAria": "Play 1 second",
    "playback.secondsAria": "Play {{seconds}} seconds",
    "answer.label": "Enter the song title",
    "answer.check": "Check",
    "action.previous": "Previous question",
    "action.next": "Next question",
    "action.hint": "Hint",
    "action.markCorrect": "Mark correct",
    "action.markWrong": "Mark incorrect",
    "action.showAnswer": "Show answer",
    "action.hideAnswer": "Hide answer",
    "action.answer": "Answer",
    "action.hide": "Hide",
    "action.nextQuestion": "Next question",
    "setup.label": "Setup",
    "setup.connect": "Connect to Music.app",
    "status.booting": "Checking server",
    "status.waiting": "Ready to connect",
    "status.startFailed": "Server unavailable",
    "status.connecting": "Connecting",
    "status.connected": "Connected",
    "status.connectFailed": "Connection failed",
    "source.title": "Question source",
    "source.search": "Search",
    "source.playlist": "Playlist",
    "source.library": "Library",
    "source.searchLabel": "Search Music.app",
    "source.searchPlaceholder": "Song title or artist",
    "source.load": "Load",
    "source.loadPlaylists": "Load playlists",
    "source.notLoaded": "Not loaded",
    "source.loadTracks": "Load tracks",
    "source.loadLibrary": "Load from library",
    "source.noPlaylists": "No playlists found",
    "source.selectPlaylist": "Select a playlist",
    "settings.title": "Game settings",
    "settings.artistLimit": "Tracks per artist",
    "settings.oneTrack": "Up to 1 track",
    "settings.twoTracks": "Up to 2 tracks",
    "settings.noLimit": "No limit",
    "settings.buildDeck": "Build quiz deck",
    "candidates.title": "Candidates",
    "candidates.loaded": "Loaded tracks",
    "candidates.deck": "Quiz tracks",
    "busy.searching": "Searching",
    "busy.fetching": "Loading",
    "busy.loading": "Loading",
    "message.ready": "Ready. Music.app will connect when you load a source. macOS may ask for Automation permission the first time.",
    "message.connected": "Connected to {{app}} {{version}}.",
    "message.searching": "Searching Music.app for: {{term}}",
    "message.searchEmpty": "No results for “{{term}}”. Only tracks already added to your Music.app library are available.",
    "message.playlistsLoading": "Loading playlists from Music.app",
    "message.playlistsLoaded": "Loaded {{count}} playlists.",
    "message.playlistLoading": "Loading random tracks from the playlist",
    "message.playlistLimited": "This playlist is large, so {{count}} tracks were selected at random.",
    "message.libraryLoading": "Loading random tracks from the library",
    "message.candidatesLoaded": "Loaded {{count}} candidate tracks.",
    "message.deckBuilt": "Built a quiz deck with {{count}} tracks.",
    "message.deckReshuffled": "Reached the end of the deck and reshuffled it.",
    "message.introPlaying": "Playing {{seconds}} seconds in Music.app.",
    "message.paused": "Paused Music.app.",
    "message.correct": "Correct!",
    "message.almost": "Not quite. The answer is “{{title}}”.",
    "message.markedCorrect": "Marked as correct.",
    "message.markedWrong": "Marked as incorrect.",
    "message.alreadyCorrect": "Already marked as correct.",
    "message.alreadyWrong": "Already marked as incorrect.",
    "message.highlight": "Playing from around {{seconds}} seconds.",
    "message.moreTracks": "{{count}} more tracks",
    "message.preferredPlaylist": "Selected “{{name}}” as the suggested playlist.",
    "question.start": "Load some tracks to begin",
    "question.round": "Question {{round}}",
    "question.subtitle": "Questions come from your Music.app library",
    "question.artistHidden": "Artist hidden",
    "question.artworkAlt": "Album artwork for {{title}}",
    "hint.title": "Title: {{value}}",
    "hint.artist": "Artist: {{value}}...",
    "hint.album": "Album: {{value}}",
    "hint.year": "Year: {{value}}",
    "hint.duration": "Length: {{value}}",
    "error.serverUnavailable": "Could not reach the local server.",
    "error.searchRequired": "Enter a search term.",
    "error.playlistRequired": "Select a playlist.",
    "error.loadCandidates": "Load some candidate tracks first.",
    "error.buildDeck": "Build a quiz deck first.",
    "error.firstQuestion": "This is the first question.",
    "error.startQuestion": "Start a question first.",
    "error.answerRequired": "Enter an answer.",
    "error.connectFailed": "Could not connect to Music.app.",
    "error.automation": "macOS Automation permission is required. Allow this app to control Music.app when prompted.",
    "error.musicUnavailable": "Could not control Music.app. Open Music.app and confirm that you are signed in to Apple Music.",
  },
};

const state = {
  locale: getInitialLocale(),
  connected: false,
  sourceMode: "playlist",
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
  statusKey: null,
  statusVariant: "",
};

const el = {
  body: document.body,
  languageSelect: byId("languageSelect"),
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
  applyLanguage(state.locale, { persist: false });
  bindEvents();
  setButtonsEnabled(false);
  el.authorizeButton.disabled = true;
  setStatus("status.booting", "");

  try {
    const health = await apiJson("/api/health");
    if (!health.ok) throw new Error(t("error.serverUnavailable"));
    el.authorizeButton.disabled = false;
    setSourceButtonsEnabled(true);
    setStatus("status.waiting", "ready");
    log(t("message.ready"));
  } catch (error) {
    setStatus("status.startFailed", "error");
    logError(error);
  }
}

function bindEvents() {
  el.languageSelect.addEventListener("change", () => applyLanguage(el.languageSelect.value));
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
    setStatus("status.connecting", "");
    const status = await apiJson("/api/music/status");
    state.connected = true;
    setButtonsEnabled(true);
    el.loadLibraryTracksButton.disabled = true;
    setStatus("status.connected", "ready");
    log(t("message.connected", { app: status.appName || "Music.app", version: status.version || "" }));
  } catch (error) {
    state.connected = false;
    setButtonsEnabled(false);
    setStatus("status.connectFailed", "error");
    logError(error);
  }
}

async function loadSearch() {
  const done = setBusy(el.searchButton, t("busy.searching"));
  try {
    const term = el.searchTerm.value.trim();
    if (!term) throw new Error(t("error.searchRequired"));

    await ensureConnected();
    log(t("message.searching", { term }));
    const body = await apiJson(`/api/music/search?term=${encodeURIComponent(term)}&limit=80`);
    const tracks = body.tracks || [];
    setCandidates(tracks);
    if (!tracks.length) {
      log(t("message.searchEmpty", { term }));
    }
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibraryPlaylists() {
  const done = setBusy(el.loadLibraryPlaylistsButton, t("busy.fetching"));
  try {
    await ensureConnected();
    log(t("message.playlistsLoading"));
    const body = await apiJson("/api/music/playlists");
    const playlists = body.playlists || [];
    el.libraryPlaylistSelect.innerHTML = "";

    if (!playlists.length) {
      const emptyOption = new Option(t("source.noPlaylists"), "");
      emptyOption.dataset.i18n = "source.noPlaylists";
      emptyOption.disabled = true;
      emptyOption.selected = true;
      el.libraryPlaylistSelect.append(emptyOption);
      el.libraryPlaylistSelect.disabled = true;
      el.loadLibraryTracksButton.disabled = true;
      return;
    }

    const placeholderOption = new Option(t("source.selectPlaylist"), "");
    placeholderOption.dataset.i18n = "source.selectPlaylist";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    el.libraryPlaylistSelect.append(placeholderOption);

    for (const playlist of playlists) {
      const label = `${playlist.name} (${playlist.count})`;
      const option = new Option(label, playlist.id);
      option.dataset.count = String(playlist.count || 0);
      el.libraryPlaylistSelect.append(option);
    }
    selectPreferredPlaylist(playlists);
    el.libraryPlaylistSelect.disabled = false;
    el.loadLibraryTracksButton.disabled = !el.libraryPlaylistSelect.value;
    log(t("message.playlistsLoaded", { count: playlists.length }));
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibraryTracks() {
  const done = setBusy(el.loadLibraryTracksButton, t("busy.loading"));
  try {
    await ensureConnected();
    const playlistId = el.libraryPlaylistSelect.value;
    if (!playlistId) throw new Error(t("error.playlistRequired"));
    const selectedOption = el.libraryPlaylistSelect.selectedOptions[0];
    const playlistCount = Number(selectedOption?.dataset.count || 0);
    const limit = Math.min(playlistCount || TRACK_LOAD_LIMIT, TRACK_LOAD_LIMIT);

    log(t("message.playlistLoading"));
    const body = await apiJson(`/api/music/tracks?playlistId=${encodeURIComponent(playlistId)}&limit=${limit}&shuffle=1`);
    setCandidates(body.tracks || []);
    if (playlistCount > TRACK_LOAD_LIMIT) {
      log(t("message.playlistLimited", { count: TRACK_LOAD_LIMIT }));
    }
  } catch (error) {
    logError(error);
  } finally {
    done();
  }
}

async function loadLibrary() {
  const done = setBusy(el.loadLibraryButton, t("busy.loading"));
  try {
    await ensureConnected();
    log(t("message.libraryLoading"));
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
  log(t("message.candidatesLoaded", { count: state.candidates.length }));
}

async function buildDeck() {
  try {
    if (!state.candidates.length) throw new Error(t("error.loadCandidates"));
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
    log(t("message.deckBuilt", { count: state.deck.length }));
  } catch (error) {
    logError(error);
  }
}

async function nextQuestion() {
  try {
    if (!state.deck.length) throw new Error(t("error.buildDeck"));
    await pausePlayback({ quiet: true });

    if (state.currentIndex >= 0 && state.currentIndex < state.history.length - 1) {
      showQuestionAt(state.currentIndex + 1);
      return;
    }

    if (state.deckCursor >= state.deck.length) {
      state.deck = shuffle([...state.deck]);
      state.deckCursor = 0;
      log(t("message.deckReshuffled"));
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
    if (!state.deck.length) throw new Error(t("error.buildDeck"));
    if (state.currentIndex <= 0) throw new Error(t("error.firstQuestion"));
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
    if (!state.current) throw new Error(t("error.startQuestion"));
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
    log(t("message.introPlaying", { seconds }));
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
    if (!options.quiet) log(t("message.paused"));
  } catch (error) {
    if (!options.quiet) logError(error);
  }
}

function checkAnswer() {
  try {
    if (!state.current) throw new Error(t("error.startQuestion"));
    const answer = el.answerInput.value.trim();
    if (!answer) throw new Error(t("error.answerRequired"));

    const expected = normalizeText(state.current.name);
    const actual = normalizeText(answer);
    const distance = levenshtein(expected, actual);
    const score = 1 - distance / Math.max(expected.length, actual.length, 1);

    if (actual === expected || score >= 0.82) {
      el.judgeResult.textContent = t("message.correct");
      el.judgeResult.className = "judge-result is-ok";
      mark(true, { reveal: true, quiet: true });
    } else {
      el.judgeResult.textContent = t("message.almost", { title: state.current.name });
      el.judgeResult.className = "judge-result is-ng";
    }
  } catch (error) {
    logError(error);
  }
}

function showHint() {
  try {
    if (!state.current) throw new Error(t("error.startQuestion"));
    const song = state.current;
    const hints = [
      t("hint.title", { value: maskText(song.name) }),
      t("hint.artist", { value: song.artistName.charAt(0) || "?" }),
    ];
    if (song.albumName) hints.push(t("hint.album", { value: song.albumName }));
    if (song.year) hints.push(t("hint.year", { value: song.year }));
    if (song.duration) hints.push(t("hint.duration", { value: formatDuration(song.duration) }));
    el.hintBox.textContent = hints.join(" / ");
  } catch (error) {
    logError(error);
  }
}

function revealAnswer() {
  try {
    if (!state.current) throw new Error(t("error.startQuestion"));
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
    el.judgeResult.textContent = t(isCorrect ? "message.markedCorrect" : "message.markedWrong");
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
    el.judgeResult.textContent = t("message.alreadyCorrect");
    el.judgeResult.className = "judge-result is-ok";
    return;
  }
  if (result === false) {
    el.judgeResult.textContent = t("message.alreadyWrong");
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

  el.questionLabel.textContent = hasSong ? t("question.round", { round: state.round }) : t("question.start");
  el.maskedTitle.textContent = !hasSong ? "---" : revealed ? song.name : "????";
  el.maskedArtist.textContent = !hasSong
    ? t("question.subtitle")
    : revealed
      ? song.artistName
      : t("question.artistHidden");
  el.revealButton.textContent = t(revealed ? "action.hide" : "action.answer");
  el.revealButton.setAttribute("aria-label", t(revealed ? "action.hideAnswer" : "action.showAnswer"));
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
  el.artworkImage.alt = t("question.artworkAlt", { title: song.name });
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
  el.nextButton.textContent = isCorrect ? t("action.nextQuestion") : "→";
  el.nextButton.setAttribute("aria-label", t(isCorrect ? "action.nextQuestion" : "action.next"));
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
  log(t("message.highlight", { seconds: Math.round(position) }));
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
    title.textContent = t("message.moreTracks", { count });
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
    playlists.find((playlist) => /イントロ|intro/i.test(playlist.name));

  if (!preferred) {
    el.libraryPlaylistSelect.value = "";
    return;
  }
  el.libraryPlaylistSelect.value = preferred.id;
  log(t("message.preferredPlaylist", { name: preferred.name }));
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
    throw new Error(localizeServerError(body.error) || response.statusText || "API error");
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
    throw new Error(t("error.connectFailed"));
  }
}

function setStatus(key, variant) {
  state.statusKey = key;
  state.statusVariant = variant;
  el.configStatus.textContent = t(key);
  el.configStatus.className = "status-pill";
  if (variant === "ready") el.configStatus.classList.add("is-ready");
  if (variant === "error") el.configStatus.classList.add("is-error");
}

function log(message) {
  const time = new Date().toLocaleTimeString(state.locale === "ja" ? "ja-JP" : "en-US", { hour12: false });
  el.logBox.textContent = `[${time}] ${message}\n${el.logBox.textContent}`.slice(0, 5000);
}

function logError(error) {
  const message = error instanceof Error ? error.message : String(error);
  log(`ERROR: ${message}`);
}

function applyLanguage(locale, options = {}) {
  state.locale = locale === "ja" ? "ja" : "en";
  document.documentElement.lang = state.locale;
  document.title = t("meta.title");
  el.languageSelect.value = state.locale;
  el.languageSelect.setAttribute("aria-label", t("language.label"));

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  el.durationPresetButtons.forEach((button) => {
    const seconds = Number(button.dataset.duration);
    button.setAttribute("aria-label", t(seconds === 1 ? "playback.secondAria" : "playback.secondsAria", { seconds }));
  });

  if (options.persist !== false) {
    try {
      localStorage.setItem("intro-don-language", state.locale);
    } catch {
      // Language selection still works when storage is unavailable.
    }
  }

  if (state.statusKey) setStatus(state.statusKey, state.statusVariant);
  renderCandidates();
  renderCurrent();
  renderStoredJudgeResult();
}

function t(key, values = {}) {
  const template = I18N[state.locale]?.[key] ?? I18N.en[key] ?? key;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => String(values[name] ?? ""));
}

function getInitialLocale() {
  try {
    const stored = localStorage.getItem("intro-don-language");
    if (stored === "ja" || stored === "en") return stored;
  } catch {
    // Fall back to the browser language when storage is unavailable.
  }
  return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function localizeServerError(message) {
  if (!message) return "";
  if (message.startsWith("macOSのAutomation許可が必要です。")) return t("error.automation");
  if (message.startsWith("Music.appを操作できませんでした。")) return t("error.musicUnavailable");
  return message;
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
