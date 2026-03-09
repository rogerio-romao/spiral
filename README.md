# Spiral test

**A music player that turns your screen into a living canvas.**

Spiral is a desktop app that plays your favorite tunes while creating
mesmerizing generative art in real-time. Watch as dozens of different procedural
algorithms paint ever-changing patterns, spirals, and abstract visuals
synchronized to your music.

## Getting Started

### Installation

You'll need [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
installed on your computer.

```bash
# Clone this repository
git clone https://github.com/rogerio-romao/spiral.git

# Go into the directory
cd spiral

# Install dependencies
pnpm install

# Launch the app
pnpm start
```

That's it! The app should open up and you can start playing music and enjoying
the visuals.

## How to Use It

- **Space** — Switch to a random new visualization
- **M** — Toggle the music player open/closed
- **P** — Play/pause music
- **←** / **→** — Previous/next track
- **X** — Stop playback
- **H** — Show the help menu with all keyboard shortcuts
- **F** — Toggle fullscreen mode
- **+** — Increase auto-change interval (+10s)
- **-** — Decrease auto-change interval (-10s)
- **A** — Toggle manual/auto mode
- **S** — Toggle silent mode (hides algorithm name)
- **W** — Toggle waveform display

Load up your favorite tracks, hit play, and let the algorithms do their thing.
Each visualization is unique and will never look exactly the same twice.

### Saving Your Playlist

Click **Save Playlist** (inside the expanded playlist view) to persist your
current tracks to disk. On the next launch the playlist and the track you were
last on will be restored automatically. Switching tracks while a playlist is
saved keeps the saved position up to date — no need to save again. Click
**Clear Saved Playlist** to remove the saved playlist and start fresh.

## What's the Point?

Sometimes you just want to zone out with some good music and watch something
beautiful. Spiral is perfect for:

- Background visuals during parties or gatherings
- Relaxing after a long day
- Creative inspiration while working
- Just having something cool to look at

No complicated controls, no setup hassle — just music and art working together.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
