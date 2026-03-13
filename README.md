# The Appreciation Mirror

A mirror for your appreciation and gratitude. This activity invites you to leave small notes of appreciation for yourself.

## Technologies Used

- Vite
- TypeScript
- React
- i18next
- Tailwind CSS
- shadcn-ui
- Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Internationalization

This project supports 20 languages. Translations are managed via `i18next` and stored in `src/i18n/locales`.

## Deployment

The project is configured for deployment via Docker and Nginx on a subpath `/the-appreciation-mirror/`.

### Docker

Build the image:
```sh
docker build -t the-appreciation-mirror .
```

Run the container:
```sh
docker run -p 8080:80 the-appreciation-mirror
```
