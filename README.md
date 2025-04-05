# GUI for the [HoloTable Middleware](https://github.com/METIL-HoloAI/HoloTable-Middleware)

This desktop application allows users configure the APIs for the Middleware (STT, Content Generation, etc.) and to input text or speech through the front end.

Built with [this](https://github.com/alysonhower/tauri2-svelte5-shadcn) boilerplate for Tauri 2 with Svelte 5 (and shadcn-svelte) using Bun runtime.

## Prerequisites

All required installations for your OS can be found here:

- https://tauri.app/start/prerequisites/

Some useful links:

- https://bun.sh/docs/installation
- https://www.rust-lang.org/tools/install
- https://visualstudio.microsoft.com/vs/community/

## Setup

```
git clone https://github.com/METIL-HoloAI/HoloTable-Middleware-GUI.git
cd HoloTable-Middleware-GUI
bun i
```

## Useful commands

### Start desktop dev server

```
bun run tauri dev
```

### Start browser dev server

```
bun run pnpm dev --open
```

### Build executable file

```
bun run tauri build
```

## Other links

### Svelte 5

https://svelte.dev/docs

### Tauri 2

https://tauri.app/start/

### shadcn-svelte

https://next.shadcn-svelte.com/

## To run as a desktop app

### In one terminal:

```
docker run --rm -p 2700:2700 alphacep/kaldi-en:latest
```

### In root directory of the middleware:

```
go run ./...
```

### In root directory of the GUI:

```
bun run tauri build
```

Then open the executable file.
With the Go server and Docker image running, the frontend should be able to send prompts through text/voice, as well as fetch/update configuration files.
