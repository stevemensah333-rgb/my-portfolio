# Stephen Mensah — Portfolio

My personal portfolio. I'm a software engineer who builds AI-powered applications and backend systems, with a focus on reliability.

🌐 Live site: [stephen-mensah-portfolio.vercel.app](https://stephen-mensah-portfolio.vercel.app/)

## Built with

- Astro
- TypeScript
- CSS
- JavaScript

## Highlights

- Syncareer — an AI-powered career platform, and the engineering case study behind its AI feature
- Project and technical work
- Experience and selected credentials

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run check   # astro check — types and templates
npm test        # the Reliability Lab's scenario logic (node --test)
npm run build   # static build
```

`src/scripts/labScenario.mjs` holds the one scenario `/lab/` demonstrates: the
context a request carries, an unfit reply, the gate that refuses it, a cited
proposal that passes, and the review a person still has to do. It is pure,
deterministic and offline — the page renders its result and the tests assert it.
No model is called.
