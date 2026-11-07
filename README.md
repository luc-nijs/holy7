# theholy7.be

Website of The Holy 7, rebuilt in [Astro](https://astro.build) from the Wix site
(theholy7.wixsite.com/theholy7). The home page follows tristannijs.media.

```bash
npm install
npm run dev
```

- `src/pages/` – one file per page
- `src/layouts/Base.astro` – top bar, menu and footer
- `src/data/site.js` – menu, social links, contact address
- `src/data/videos.js` – the YouTube films (home carousel and Media page)
- `src/lib/news.js`, `src/lib/agenda.js` – News and Agenda, read live from published Google Sheets
- `src/styles/site.css` – layout, fonts (Geist) and colours
- `public/images/` – web-sized photos; the originals stay on the LaCie disk (Holy7_Beelden)
