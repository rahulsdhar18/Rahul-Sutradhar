# Rahul Sutradhar — Portfolio Website

A responsive, static portfolio website built with HTML, CSS, and vanilla JavaScript. It uses an architectural dark/light visual system, restrained acid-lime accents, smooth in-page navigation, a mobile menu, scroll-aware navigation, reduced-motion support, dynamic project rendering, and a three-mode abstract hero graphic.

## Run it

1. Extract the folder.
2. Open `index.html` in a browser.
3. For best local development, use VS Code with Live Server.

No build step or package installation is required.

## Personalize it

Open `content.js` and update the `PORTFOLIO_DATA` object. The following fields are supported:

- `name`, `role`, `location`, `about`, `email`
- `social.linkedin`, `social.github`, `social.instagram`
- `facts`: quick facts as `{ label, value }`
- `projects`: `{ title, category, description, year, featured, tools, image, imageAlt, liveUrl, repoUrl, shortLabel }`
- `skills`: `{ group, items }`
- `timeline`: `{ date, title, place, description }`

Projects, skills, timeline, and quick facts are optional. Empty sections stay hidden where appropriate. Only add real details and verified URLs. A project with no image gets an abstract placeholder graphic rather than a fabricated screenshot.

## Contact details

Email/social buttons only appear when valid details are provided. The current contact section explains where to add them; it does not pretend to send messages.

## Notes

- Uses Google Fonts when online and falls back to local system fonts when offline.
- The OG preview and favicon are included in `assets/`.
- There is no backend or contact form configured; the site is static by design.
