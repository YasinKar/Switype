# switype

*A fun, multi‑language typing practice app built with **React Native** and **Expo**.*

<div align="center">

![Platform](https://img.shields.io/badge/platform-iOS%20|%20Android%20|%20Web-4B5563)
![Expo](https://img.shields.io/badge/Expo-51.0+-000?logo=expo)
![React%20Native](https://img.shields.io/badge/React%20Native-0.75+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-10B981)

</div>

> **switype** is a lightweight typing trainer that supports multiple languages and layouts. It’s great for daily warm‑ups, building speed/WPM, and tracking accuracy—all wrapped in a clean, distraction‑free UI.

---

## ✨ Features

* **Multi‑language support** (switch layouts on the fly)
* **Real‑time metrics**: WPM, accuracy, error heatmap, streaks
* **Lesson modes**: random words, quotes, custom text, time/words tests
* **Mobile‑first UX** with haptics/sounds and optional key‑hints
* **Dark/Light themes** and high‑contrast accessibility mode
* **Offline‑friendly**; state persisted locally
* **Works on iOS, Android, and Web** via Expo

---

## 🖼️ Preview

Add your screenshots to `./assets/preview/` and update paths below.

<p align="center">
  <img src="assets/preview/home.png" alt="Home" width="240"/>
  <img src="assets/preview/session.png" alt="Typing Session" width="240"/>
  <img src="assets/preview/stats.png" alt="Stats" width="240"/>
  <img src="assets/preview/languages.png" alt="Languages" width="240"/>
</p>

> Tip: You can replace these with Markdown image links if you prefer.

---

## 🧰 Tech Stack

* **React Native** + **Expo**
* **TypeScript**
* Optional: **Expo Router**, **Zustand/Redux** for state, **Reanimated** for UI polish

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** 18+
* **pnpm** / **yarn** / **npm** (choose one)
* **Expo CLI** (installed automatically via `npx`, or `pnpm dlx expo`)

### Installation

```bash
# clone
git clone https://github.com/your-username/switype.git
cd switype

# install deps (pick ONE)
pnpm install
# or
yarn
# or
npm install
```

### Run (development)

```bash
# start the Expo dev server
pnpm expo start
# or
pnpm dlx expo start
# or
yarn expo start
# or
npx expo start
```

Then press:

* **i** for iOS Simulator (macOS)
* **a** for Android Emulator
* **w** for Web (Expo for Web)

### Build (optional)

```bash
# build with EAS (recommended)
pnpm dlx eas build --platform ios
pnpm dlx eas build --platform android

# or local web build
pnpm expo export --platform web
```

> Configure EAS by running `pnpm dlx eas build:configure` and setting up `eas.json`.

---

## 🔧 Configuration

Create a `.env` (or `app.config.ts` fields) if you need runtime flags:

```bash
APP_NAME=switype
DEFAULT_LANGUAGE=en
ENABLE_SOUNDS=true
```

Reference env values via `expo-constants` or a config plugin.

---

## 🌐 Languages

Add or edit language packs in `src/languages/`:

* `en` — English
* `de` — German
* `fr` — French
* `es` — Spanish
* `fa` — Persian (Farsi)
* `…` add more via simple JSON wordlists/layout maps

Each language can define:

```ts
{
  code: "en",
  label: "English",
  layout: "qwerty",
  words: string[],
  punctuation: boolean,
}
```

---

## 🎯 Usage

* Open **Language Switcher** to change layout/words
* Pick a **Mode** (Timed, Words, Custom Text, Quotes)
* Start typing; metrics update live (WPM, accuracy, errors)
* Finish to save the run and see a breakdown (graphs + heatmap)

---

## ⌨️ Shortcuts (Web/Desktop)

* **Space** — start/pause
* **Esc** — reset session
* **Cmd/Ctrl + L** — language picker
* **Cmd/Ctrl + T** — theme toggle

---

## 🗂️ Project Structure (suggested)

```
switype/
├─ app/                 # screens/routes (Expo Router)
├─ src/
│  ├─ components/
│  ├─ features/typing/
│  ├─ hooks/
│  ├─ languages/
│  ├─ store/
│  └─ utils/
├─ assets/
│  └─ preview/          # screenshots for README
├─ app.config.ts
├─ package.json
└─ README.md
```

---

## 🧪 Testing (optional)

```bash
pnpm test
# with watch
pnpm test -- --watch
```

---

## 🤝 Contributing

PRs are welcome! If you’re adding a language pack, include:

* `src/languages/<code>.ts` with wordlist/layout
* A brief note in the README **Languages** section

Please run `pnpm lint` before submitting.

---

## 🗺️ Roadmap

* [ ] More built‑in languages & layouts
* [ ] Custom lesson builder + import/export
* [ ] Cloud sync for stats
* [ ] Leaderboard / daily challenges
* [ ] Haptic profiles & sound themes

---

## 🐞 Troubleshooting

* **Simulator doesn’t start** → ensure Xcode/Android Studio are installed & emulators configured
* **Fonts/Sounds not loading on Web** → verify asset paths in `app.config.ts`
* **Slow input on web** → disable heavy animations or dev overlays

---

## 📄 License

[MIT](LICENSE)

---

## 🙌 Acknowledgments

* Inspired by classic typing trainers and open wordlists
* Thanks to the Expo & React Native community ❤️