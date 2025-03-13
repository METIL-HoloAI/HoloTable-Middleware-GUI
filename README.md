# GUI to be used alongside the [HoloTable Middleware](https://github.com/METIL-HoloAI/HoloTable-Middleware)
Built with [this](https://github.com/alysonhower/tauri2-svelte5-shadcn) boilerplate for Tauri 2 with Svelte 5 (and shadcn-svelte) using Bun runtime.

## Prerequisites
In order to run this project, you need to install Bun and Rust. If you are on Windows I also recommend installing MSVC before the other dependencies (make sure to check the "Desktop development with C++" workload).

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