import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const publicDir = join(rootDir, "public");
const artworkCacheDir = join(rootDir, ".artwork-cache");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const trackResponseLimit = 2000;

let introStopTimer = null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        mode: "macos-music-app",
        configured: true,
      });
    }

    if (url.pathname === "/api/music/status") {
      return await handleStatus(res);
    }

    if (url.pathname === "/api/music/playlists") {
      return await handlePlaylists(res);
    }

    if (url.pathname === "/api/music/tracks") {
      return await handleTracks(url, res);
    }

    if (url.pathname === "/api/music/search") {
      return await handleSearch(url, res);
    }

    if (url.pathname === "/api/music/library") {
      return await handleLibrary(url, res);
    }

    if (url.pathname === "/api/music/artwork") {
      return await handleArtwork(url, res);
    }

    if (url.pathname === "/api/music/play" && req.method === "POST") {
      return await handlePlay(req, res);
    }

    if (url.pathname === "/api/music/play-highlight" && req.method === "POST") {
      return await handlePlayHighlight(req, res);
    }

    if (url.pathname === "/api/music/pause" && req.method === "POST") {
      return await handlePause(res);
    }

    return await serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

server.listen(port, host, () => {
  console.log(`Intro Don Music.app is running at http://${host}:${port}`);
});

async function handleStatus(res) {
  const output = await runMusicScript(`
    tell application "Music"
      return name & tab & version
    end tell
  `);
  const [name, version] = output.trim().split("\t");
  return sendJson(res, 200, {
    ok: true,
    appName: name || "Music",
    version: version || "",
  });
}

async function handlePlaylists(res) {
  const output = await runMusicScript(`
    tell application "Music"
      set output to ""
      repeat with p in user playlists
        try
          set pid to persistent ID of p as string
          set pname to name of p as string
          set pcount to count of tracks of p
          set output to output & my playlistRow(pid, pname, pcount) & linefeed
        end try
      end repeat
      return output
    end tell
    ${appleScriptHelpers()}
  `);

  return sendJson(res, 200, {
    playlists: parseRows(output, ["id", "name", "count"]).map((playlist) => ({
      ...playlist,
      count: Number(playlist.count || 0),
    })),
  });
}

async function handleTracks(url, res) {
  const playlistId = url.searchParams.get("playlistId") || "";
  const limit = clampNumber(url.searchParams.get("limit"), 1, trackResponseLimit, 150);
  const shuffleTracks = url.searchParams.get("shuffle") === "1";
  if (!playlistId) return sendJson(res, 400, { error: "playlistId is required." });

  const output = await runMusicScript(`
    set playlistId to ${asAppleScriptString(playlistId)}
    set limitValue to ${limit}
    tell application "Music"
      set targetPlaylist to missing value
      repeat with p in user playlists
        if (persistent ID of p as string) is playlistId then
          set targetPlaylist to p
          exit repeat
        end if
      end repeat
      if targetPlaylist is missing value then error "Playlist not found."

      set output to ""
      set totalTracks to count of tracks of targetPlaylist
      set maxCount to limitValue
      if totalTracks < maxCount then set maxCount to totalTracks
      if maxCount is 0 then return output

      if ${shuffleTracks ? "true" : "false"} then
        set pickedIndexes to my randomTrackIndexes(totalTracks, maxCount)
      else
        set pickedIndexes to {}
        repeat with i from 1 to maxCount
          set end of pickedIndexes to i
        end repeat
      end if

      repeat with trackIndex in pickedIndexes
        try
          set t to track (trackIndex as integer) of targetPlaylist
          set output to output & my trackRow(t, playlistId) & linefeed
        end try
      end repeat
      return output
    end tell
    ${appleScriptHelpers()}
  `);

  return sendJson(res, 200, {
    tracks: parseTracks(output),
  });
}

async function handleSearch(url, res) {
  const term = (url.searchParams.get("term") || "").trim();
  const limit = clampNumber(url.searchParams.get("limit"), 1, 300, 100);
  if (!term) return sendJson(res, 400, { error: "term is required." });

  const output = await runMusicScript(`
    set searchTerm to ${asAppleScriptString(term)}
    set limitValue to ${limit}
    tell application "Music"
      set output to ""
      set foundTracks to search library playlist 1 for searchTerm only songs
      set foundCount to count of foundTracks
      set maxCount to limitValue
      if foundCount < maxCount then set maxCount to foundCount
      repeat with i from 1 to maxCount
        try
          set t to item i of foundTracks
          set output to output & my trackRow(t, "__library__") & linefeed
        end try
      end repeat
      return output
    end tell
    ${appleScriptHelpers()}
  `);

  return sendJson(res, 200, {
    tracks: parseTracks(output),
  });
}

async function handleLibrary(url, res) {
  const limit = clampNumber(url.searchParams.get("limit"), 1, trackResponseLimit, 200);
  const shuffleTracks = url.searchParams.get("shuffle") === "1";
  const output = await runMusicScript(`
    set limitValue to ${limit}
    tell application "Music"
      set output to ""
      set totalTracks to count of tracks of library playlist 1
      set maxCount to limitValue
      if totalTracks < maxCount then set maxCount to totalTracks
      if maxCount is 0 then return output

      if ${shuffleTracks ? "true" : "false"} then
        set pickedIndexes to my randomTrackIndexes(totalTracks, maxCount)
      else
        set pickedIndexes to {}
        repeat with i from 1 to maxCount
          set end of pickedIndexes to i
        end repeat
      end if

      repeat with trackIndex in pickedIndexes
        try
          set t to track (trackIndex as integer) of library playlist 1
          set output to output & my trackRow(t, "__library__") & linefeed
        end try
      end repeat
      return output
    end tell
    ${appleScriptHelpers()}
  `);

  return sendJson(res, 200, {
    tracks: parseTracks(output),
  });
}

async function handlePlay(req, res) {
  const body = await readJsonBody(req);
  const playlistId = String(body.playlistId || "");
  const trackId = String(body.trackId || "");
  const seconds = clampNumber(body.seconds, 1, 30, 3);

  if (!trackId) return sendJson(res, 400, { error: "trackId is required." });

  await playTrack({ playlistId, trackId });
  schedulePause(seconds);

  return sendJson(res, 200, {
    ok: true,
    seconds,
  });
}

async function handlePlayHighlight(req, res) {
  const body = await readJsonBody(req);
  const playlistId = String(body.playlistId || "");
  const trackId = String(body.trackId || "");
  const position = clampNumber(body.position, 0, 7200, 45);

  if (!trackId) return sendJson(res, 400, { error: "trackId is required." });

  if (introStopTimer) {
    clearTimeout(introStopTimer);
    introStopTimer = null;
  }

  await playTrack({ playlistId, trackId, position });

  return sendJson(res, 200, {
    ok: true,
    position,
  });
}

async function handlePause(res) {
  await pauseMusic();
  return sendJson(res, 200, { ok: true });
}

async function handleArtwork(url, res) {
  const playlistId = url.searchParams.get("playlistId") || "__library__";
  const trackId = url.searchParams.get("trackId") || "";
  if (!trackId) return sendJson(res, 400, { error: "trackId is required." });

  const cacheKey = sanitizeArtworkKey(`${playlistId}-${trackId}`);
  const artworkPath = join(artworkCacheDir, `${cacheKey}.bin`);

  try {
    let bytes = await readCachedArtwork(artworkPath);
    if (!bytes) {
      await mkdir(artworkCacheDir, { recursive: true });
      await exportArtwork({ playlistId, trackId, outputPath: artworkPath });
      bytes = await readCachedArtwork(artworkPath);
    }

    if (!bytes) return sendJson(res, 404, { error: "Artwork not found." });
    return sendBuffer(res, 200, bytes, detectImageContentType(bytes));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("Artwork not found") ||
      message.includes("Track not found") ||
      message.includes("Can't get") ||
      message.includes("Can’t get")
    ) {
      return sendJson(res, 404, { error: "Artwork not found." });
    }
    throw error;
  }
}

async function playTrack({ playlistId, trackId, position = 0 }) {
  const sourcePlaylist = playlistId && playlistId !== "__library__" ? "playlist" : "library";
  const playerPosition = Math.max(0, Number(position || 0));
  await runMusicScript(`
    set sourcePlaylist to ${asAppleScriptString(sourcePlaylist)}
    set playlistId to ${asAppleScriptString(playlistId)}
    set trackId to ${asAppleScriptString(trackId)}
    set startPosition to ${playerPosition}

    tell application "Music"
      if sourcePlaylist is "playlist" then
        set targetPlaylist to missing value
        repeat with p in user playlists
          if (persistent ID of p as string) is playlistId then
            set targetPlaylist to p
            exit repeat
          end if
        end repeat
        if targetPlaylist is missing value then error "Playlist not found."
      else
        set targetPlaylist to library playlist 1
      end if

      set targetTrack to missing value
      set totalTracks to count of tracks of targetPlaylist
      repeat with i from 1 to totalTracks
        try
          set t to track i of targetPlaylist
          if (persistent ID of t as string) is trackId then
            set targetTrack to t
            exit repeat
          end if
        end try
      end repeat
      if targetTrack is missing value then error "Track not found."

      play targetTrack
      delay 0.15
      try
        set player position to startPosition
      end try
    end tell
  `);
}

async function exportArtwork({ playlistId, trackId, outputPath }) {
  const sourcePlaylist = playlistId && playlistId !== "__library__" ? "playlist" : "library";
  await runMusicScript(`
    set sourcePlaylist to ${asAppleScriptString(sourcePlaylist)}
    set playlistId to ${asAppleScriptString(playlistId)}
    set trackId to ${asAppleScriptString(trackId)}
    set outputPath to ${asAppleScriptString(outputPath)}

    tell application "Music"
      if sourcePlaylist is "playlist" then
        set targetPlaylist to first user playlist whose persistent ID is playlistId
        set targetTrack to first track of targetPlaylist whose persistent ID is trackId
      else
        set targetTrack to first track of library playlist 1 whose persistent ID is trackId
      end if

      if targetTrack is missing value then error "Track not found."
      if (count of artworks of targetTrack) is 0 then error "Artwork not found."
      set artworkData to raw data of artwork 1 of targetTrack
    end tell

    set outputFile to open for access (POSIX file outputPath) with write permission
    try
      set eof outputFile to 0
      write artworkData to outputFile
      close access outputFile
    on error errMsg
      try
        close access outputFile
      end try
      error errMsg
    end try
  `);
}

async function pauseMusic() {
  if (introStopTimer) {
    clearTimeout(introStopTimer);
    introStopTimer = null;
  }

  await runMusicScript(`
    tell application "Music"
      pause
    end tell
  `);
}

function schedulePause(seconds) {
  if (introStopTimer) clearTimeout(introStopTimer);
  introStopTimer = setTimeout(() => {
    introStopTimer = null;
    pauseMusic().catch((error) => {
      console.error("Failed to pause Music.app:", error);
    });
  }, seconds * 1000);
}

function runMusicScript(script) {
  return new Promise((resolvePromise, rejectPromise) => {
    execFile("osascript", ["-e", script], { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        const detail = stderr.trim() || error.message;
        rejectPromise(new Error(toFriendlyAppleScriptError(detail)));
        return;
      }
      resolvePromise(stdout);
    });
  });
}

function toFriendlyAppleScriptError(message) {
  if (message.includes("not authorized") || message.includes("not allowed")) {
    return "macOSのAutomation許可が必要です。表示された確認で、このアプリからMusic.appの操作を許可してください。";
  }
  if (message.includes("Application isn't running") || message.includes("application")) {
    return "Music.appを操作できませんでした。Music.appを起動して、Apple Musicにログイン済みか確認してください。";
  }
  return message;
}

function appleScriptHelpers() {
  return `
    on trackRow(t, sourcePlaylistId)
      tell application "Music"
        try
          set tid to persistent ID of t as string
        on error
          set tid to ""
        end try
        try
          set tname to name of t as string
        on error
          set tname to "Unknown Title"
        end try
        try
          set tartist to artist of t as string
        on error
          set tartist to "Unknown Artist"
        end try
        try
          set talbum to album of t as string
        on error
          set talbum to ""
        end try
        try
          set tduration to duration of t as real
        on error
          set tduration to 0
        end try
        try
          set tyear to year of t as integer
        on error
          set tyear to 0
        end try
      end tell
      return my emit(sourcePlaylistId, tid, tname, tartist, talbum, tduration, tyear)
    end trackRow

    on playlistRow(pid, pname, pcount)
      return my clean(pid) & tab & my clean(pname) & tab & my clean(pcount)
    end playlistRow

    on randomTrackIndexes(totalTracks, maxCount)
      set pickedIndexes to {}
      if maxCount <= 0 then return pickedIndexes

      if totalTracks <= maxCount then
        repeat with trackIndex from 1 to totalTracks
          set end of pickedIndexes to trackIndex
        end repeat
        repeat with cursorIndex from totalTracks to 2 by -1
          set targetIndex to random number from 1 to (cursorIndex as integer)
          set savedIndex to item cursorIndex of pickedIndexes
          set item cursorIndex of pickedIndexes to item targetIndex of pickedIndexes
          set item targetIndex of pickedIndexes to savedIndex
        end repeat
        return pickedIndexes
      end if

      repeat while (count of pickedIndexes) < maxCount
        set randomIndex to random number from 1 to totalTracks
        if pickedIndexes does not contain randomIndex then
          set end of pickedIndexes to randomIndex
        end if
      end repeat

      return pickedIndexes
    end randomTrackIndexes

    on emit(a, b, c, d, e, f, g)
      return my clean(a) & tab & my clean(b) & tab & my clean(c) & tab & my clean(d) & tab & my clean(e) & tab & my clean(f) & tab & my clean(g)
    end emit

    on clean(value)
      try
        set textValue to value as text
      on error
        set textValue to ""
      end try
      set textValue to my replaceText(linefeed, " ", textValue)
      set textValue to my replaceText(return, " ", textValue)
      set textValue to my replaceText(tab, " ", textValue)
      return textValue
    end clean

    on replaceText(searchText, replacementText, sourceText)
      set oldDelimiters to AppleScript's text item delimiters
      set AppleScript's text item delimiters to searchText
      set parts to text items of sourceText
      set AppleScript's text item delimiters to replacementText
      set outputText to parts as text
      set AppleScript's text item delimiters to oldDelimiters
      return outputText
    end replaceText
  `;
}

function parseTracks(output) {
  return parseRows(output, [
    "playlistId",
    "id",
    "name",
    "artistName",
    "albumName",
    "duration",
    "year",
  ]).map((track) => ({
    ...track,
    duration: Number(track.duration || 0),
    year: Number(track.year || 0),
  }));
}

function parseRows(output, keys) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const columns = line.split("\t");
      return Object.fromEntries(keys.map((key, index) => [key, columns[index] || ""]));
    });
}

function asAppleScriptString(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function sanitizeArtworkKey(value) {
  return String(value).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 180);
}

async function readCachedArtwork(path) {
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size <= 0) return null;
    return await readFile(path);
  } catch {
    return null;
  }
}

function detectImageContentType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 6 && bytes.toString("ascii", 0, 3) === "GIF") {
    return "image/gif";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return "application/octet-stream";
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function readJsonBody(req) {
  return new Promise((resolvePromise, rejectPromise) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        rejectPromise(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolvePromise({});
      try {
        resolvePromise(JSON.parse(raw));
      } catch {
        rejectPromise(new Error("Invalid JSON body."));
      }
    });
    req.on("error", rejectPromise);
  });
}

async function serveStatic(pathname, res) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const targetPath = normalize(join(publicDir, cleanPath));

  if (!targetPath.startsWith(publicDir)) {
    return sendText(res, 403, "Forbidden");
  }

  try {
    const info = await stat(targetPath);
    if (!info.isFile()) return sendText(res, 404, "Not found");
    const body = await readFile(targetPath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(targetPath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    sendText(res, 404, "Not found");
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function sendBuffer(res, status, body, contentType) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "private, max-age=86400",
  });
  res.end(body);
}

function sendText(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}
