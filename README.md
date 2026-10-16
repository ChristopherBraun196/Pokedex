# Pokédex – Christopher Braun

A Pokédex for all nine regions, built with plain JavaScript on top of the [PokéAPI](https://pokeapi.co/). It started as a project in my web development training and was rebuilt from the ground up as version 2.

**Live:** _link follows after upload_

## About

Browse the Pokémon of each region, open a detail view with stats and the full evolution line, save favorites and switch between German and English. The page works on phones from 320 px up to large screens and comes in a light and a dark theme.

Version 2 is a complete rebuild. Version 1 lives on as the tag [`v1.0`](https://github.com/ChristopherBraun196/Pokedex/tree/v1.0).

## Features

- **Nine regions** from Kanto to Paldea, loaded 20 at a time with a "Load more" button
- **Search** by German or English name, while typing or with the search button
- **Detail dialog** with base stats, height and weight, and the evolution line including level, stone, friendship or trade
- **Branched evolutions** like Eevee or Wurmple shown as alternatives instead of one long chain
- **Favorites** saved in `localStorage`, with their own view and a counter
- **German and English** for all texts, Pokémon names and type names
- **Light and dark theme**, following the system setting on the first visit

## Tech stack

- **HTML, CSS, JavaScript** (ES modules), no framework
- **Tailwind CSS 4** via the Tailwind CLI, used only through `@apply` in BEM classes, so the HTML contains no utility classes
- **PokéAPI** as the only data source

## Highlights

- **REST API in practice:** requests run in parallel with `Promise.all`, every response goes through one `fetchJson` that checks the status, and everything loaded is cached so nothing is fetched twice.
- **Lazy loading:** the evolution line is only requested when a dialog opens, images use `loading="lazy"`.
- **Evolution tree:** the nested chain from the API is walked to find the opened Pokémon's own line and its branches.
- **Loading and error states** for every request: a Pokéball spinner, a minimum loading time so it does not flicker, and error messages instead of silent failures.
- **Design tokens:** every color has a light and a dark value, including 18 type colors. Type colors are applied through a `data-type` attribute, so one set of rules serves cards, badges and the dialog.
- **Native `<dialog>`** with `showModal()`, closing with Escape or a click outside, arrow keys to page through.
- **Accessibility:** real buttons, `aria-pressed` and `aria-expanded` for toggles, `aria-label` on icon buttons, visible focus everywhere, `prefers-reduced-motion` is respected.
- **Mobile first:** two-column cards, a collapsible region menu and a full-screen dialog on phones.

## Getting started

The page itself needs no build step to run. Open `index.html` through a local server (for example the VS Code extension Live Server), because ES modules do not load from `file://`.

To change the styles, install the dependencies once and start the Tailwind watcher:

```bash
npm install
npm run watch:css
```

`styles/main.css` is compiled into `styles/build.css`. For the final upload, `npm run build:css` writes a minified version.

## Project structure

```
├── index.html
├── impressum.html
├── datenschutz.html
├── assets/
│   ├── fonts/           Unbounded and Figtree as WOFF2
│   └── img/
├── js/
│   ├── main.js          entry point
│   ├── legal.js         entry point for the legal pages
│   ├── data/            API requests, cache, regions, translations
│   ├── features/        search, favorites, regions, language, theme
│   └── components/      cards and detail dialog
└── styles/
    ├── main.css         Tailwind import, design tokens, fonts
    ├── build.css        compiled output
    └── blocks/          one file per BEM block
```

## Credits

- Data and Pokémon artwork: [PokéAPI](https://pokeapi.co/)
- Pokéball icon: image by [Darwin Bulos](https://pixabay.com/de/users/seducer-3063630/) on [Pixabay](https://pixabay.com/)
- Fonts: Unbounded and Figtree, SIL Open Font License

Pokémon and all related names are trademarks of Nintendo, Game Freak and The Pokémon Company. This is a non-commercial fan project without any affiliation.

## License

The **source code** is available under the [MIT License](./LICENSE).

The following are **not** covered by it:

- **Pokémon names, data and artwork:** loaded from the PokéAPI, trademarks of Nintendo, Game Freak and The Pokémon Company.
- **Pokéball image:** by Darwin Bulos on Pixabay, under the Pixabay Content License.
- **Fonts:** Unbounded and Figtree under the SIL Open Font License, see `assets/fonts/`.
- **Legal texts** on the imprint and privacy pages: created with Datenschutz-Generator.de and adapted.

## Contact

- Email: [kontakt@christopher-braun-dev.de](mailto:kontakt@christopher-braun-dev.de)
- LinkedIn: [christopher-braun-dev](https://www.linkedin.com/in/christopher-braun-dev)
- GitHub: [ChristopherBraun196](https://github.com/ChristopherBraun196)
