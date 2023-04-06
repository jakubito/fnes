# FNES

FNES is an [NES](https://en.wikipedia.org/wiki/Nintendo_Entertainment_System) emulator written in [AssemblyScript](https://www.assemblyscript.org)

**<https://fnes.netlify.app>**

[![Netlify Status](https://api.netlify.com/api/v1/badges/e3abcc29-8b9f-4b67-8e46-7b5fd79f436a/deploy-status)](https://app.netlify.com/sites/fnes/deploys)

![screenshot.png](https://raw.githubusercontent.com/jakubito/fnes/master/screenshot.png)

## Features

- Small and efficient webassembly core
- Lightweight javascript client for browsers
- Custom keyboard mappings
- [Standard gamepads](https://www.w3.org/TR/gamepad/#dfn-standard-gamepad) support for up to two players
- ZIP files support
- Full screen support

## Supported mappers

Click on the links below to see which games _should_ be currently compatible with FNES. Please note it is still in development, there may be random glitches and crashes with certain titles.

- [NROM (0)](https://nescartdb.com/search/advanced?ines_op=equal&ines=0)
- [MMC1 (1)](https://nescartdb.com/search/advanced?ines_op=equal&ines=1)
- [UxROM (2)](https://nescartdb.com/search/advanced?ines_op=equal&ines=2)
- [CNROM (3)](https://nescartdb.com/search/advanced?ines_op=equal&ines=3)
- [AxROM (7)](https://nescartdb.com/search/advanced?ines_op=equal&ines=7)

## Todo

- Implement more mappers (MMC3 being top priority)
- Increase PPU accuracy
- Save states
- APU (sound)

## Useful resources

### Homebrew games

- [nesworld.com](https://www.nesworld.com/article.php?system=nes&data=neshomebrew_bestof)
- [itch.io](https://itch.io/c/632436/nes-homebrew-games)
- [neshomebrew.ca](https://neshomebrew.ca/)
- [romhacking.net](https://www.romhacking.net/?page=homebrew&platform=1&category=&perpage=200&title=&author=&search=Go)

### Dev related

- [Nesdev Wiki](https://www.nesdev.org/wiki/NES_reference_guide)
- [High-level dev guide](https://bugzmanov.github.io/nes_ebook/)
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)

## Bug reporting

If you find a bug, please send me an e-mail to dobes.jakub@gmail.com or open an issue here on Github.

## License

ISC
