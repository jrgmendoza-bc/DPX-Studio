# DPX Hair Studio

Website for DPX Hair Studio, a barbershop in Megatower 1, Baguio City, Philippines 2600.

Plain HTML, CSS and JavaScript. No build step.

```
index.html          page markup
assets/styles.css   styles and ambient animations
assets/app.js       barber picker and booking form
assets/             logo, studio photo, favicon
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Placeholders to replace

- Service prices and durations
- Barber name, role, bio and photo
- Opening hours and mobile number
- Time-slot availability (sample data in `assets/app.js`)

The booking form does not send anything yet. It needs a backend, a Facebook Messenger link or a form service before it takes real bookings.

## Recent cuts and testimonials

In `index.html`, find "RECENT CUTS + TESTIMONIALS". Each `.pol` photo has a comment showing the `<img>` to use in place of the placeholder (save photos as `assets/cut-1.jpg` and so on, and change the `[Cut name]` caption). Each testimonial slide has three placeholders: the quote, the client's name and the visit. Only publish a client's name or photo with their permission.
