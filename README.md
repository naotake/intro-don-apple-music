# Intro Don for Music.app

[日本語](README.ja.md)

A local intro quiz game that uses the macOS Music app as its player. Play a few seconds from the beginning of a song and have your friends guess the title.

No Apple Developer account, MusicKit key, or `.env` file is required. The app asks Music.app to play tracks; it does not extract, store, or stream audio files.

## Requirements

- macOS
- Tracks that can be played in Music.app, including an Apple Music library
- Node.js 18 or later

Windows, Linux, iPhone, and iPad are not supported. The app searches your Music.app library and playlists, not the entire Apple Music catalog.

## Setup

```bash
git clone https://github.com/naotake/intro-don-apple-music.git
cd intro-don-apple-music
npm start
```

Open the following URL in your browser:

```text
http://127.0.0.1:4173
```

The project has no external package dependencies, so you normally do not need to run `npm install`.

## First connection

1. Open Music.app.
2. Open the setup panel using the gear button in the bottom-right corner.
3. Select `Connect to Music.app`.
4. If macOS asks for Automation permission, allow the terminal process to control Music.app.

This permission lets the local server read playlists and ask Music.app to play or pause tracks.

## Recommended playlist

For the quickest setup, create a playlist in Music.app named `Intro Don` and add the tracks you want to use.

- A playlist named `Intro Don` or `イントロドン` is selected automatically.
- Names containing `intro` or `イントロ` are also treated as suggested playlists.
- The name is optional; you can select any playlist in the setup panel.
- You can also build a quiz from search results or your entire library.

## How to play

1. Open the setup panel from the gear button in the bottom-right corner.
2. Load candidate tracks from a playlist, search, or the full library.
3. Choose the per-artist track limit and select `Build quiz deck`.
4. Select `1`, `3`, `5`, `10`, `15`, or `30` to play that many seconds from the start of the track.
5. Enter a title and select `Check`, or use `○` / `×` to score manually.
6. Reveal the answer to show the title, artist, and album artwork.

Tracks are selected randomly when a source is loaded and shuffled again when the quiz deck is built. Large playlists and libraries are limited to 2,000 randomly selected tracks per load.

The interface follows your browser language on first launch and can be switched between English and Japanese from the language menu.

## Data and privacy

- The server listens on `127.0.0.1` by default.
- Audio files are never sent to the browser or uploaded to an external server.
- Album artwork is cached temporarily in `.artwork-cache/` for display. This directory is ignored by Git.
- Playlist names and library metadata are not sent to external services.

## Troubleshooting

### Music.app does not connect

Open Music.app, then check macOS **System Settings > Privacy & Security > Automation** and confirm that your terminal is allowed to control Music.app.

### A track does not play

- Confirm that the track can be played directly in Music.app.
- Check the Music.app volume and audio output device.
- Reload the browser, then load the candidate tracks again.

### Port 4173 is already in use

Start the app on another port:

```bash
PORT=4174 npm start
```

## Disclaimer

This is an independent project and is not an official Apple product. Apple, Apple Music, and Music.app are trademarks of their respective owners. Users are responsible for confirming the terms that apply to their music and venue.

## License

[MIT License](LICENSE)
