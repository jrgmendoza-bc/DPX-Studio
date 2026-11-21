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
