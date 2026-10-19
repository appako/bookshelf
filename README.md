# Bookshelf — Reaktivate Fast-Test homework

The books sample refactored to **MVP / MVVM with MobX**. Views only render the view model of their controller.
All business and UX logic lives in controllers, stores and the repository, and is covered by fast unit tests that
don't need a browser or the network.

## Quick start

Requirements: Node `^20.19` or `>=22.12`, npm.

```bash
npm install
cp .env.example .env     # VITE_API_BASE=https://tdd.demo.reaktivate.com
npm run dev              # http://localhost:5173 — enter any nickname to open your shelf
npm test                 # 49 tests, ~2.5 s
```

| Script              | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                                           |
| `npm test`          | Vitest, single run (`npm run test:watch` for watch mode)                  |
| `npm run typecheck` | `tsc --noEmit`                                                            |
| `npm run build`     | Typecheck + production build to `dist/`                                   |
| `npm run api:gen`   | Regenerates the API client from `api/openapi.yaml` with orval (committed) |
| `npm run format`    | Prettier                                                                  |

> The API used to have a self-signed certificate. If requests fail with a certificate error, open
> https://tdd.demo.reaktivate.com/v1/books/test/ in the browser once and accept the certificate.

## What's implemented

**Part 1**

- [x] Logic is separated from rendering. Views (`*.view.tsx`) contain no conditions, calculations, hooks or handlers.
      They take the controller from `useController` and bind its fields to markup.
- [x] MobX holds the state, and `mobx-react-lite` `observer` provides reactivity.
- [x] Adding books: a form with validation, a saving state and an error state. The lists refresh after a save.
- [x] The logic is covered by tests (see [Tests](#tests)).

**Part 2**

- [x] A mutually exclusive **All books / Private books** switch (tabs with `role="tab"` and `aria-selected`).
- [x] A sticky, **application-wide header** with the "Your books: N" counter (the number of private books), the
      current nickname and log out. It updates as soon as a book is added anywhere in the app.

**Extra:** a login screen for the API "user" nickname, persisted in `localStorage`, and **Clear my books** in
the header. It calls `PUT /reset` after an inline "Yes, clear / Cancel" confirmation, then refreshes the counter
and the lists.

## Architecture

```
View  ──actions──▶  Controller  ──PM──▶  Repository  ──DTO──▶  Gateway (orval-generated API)
      ◀──VM (observable)──      ◀──PM──              ◀──DTO──
```

| Layer          | Files                                                    | Responsibility                                                                                                         |
| -------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **View**       | `*.view.tsx`                                             | Functional `observer` components. They render the VM and pass user actions to controller methods.                      |
| **Controller** | `*.controller.ts`                                        | One per component that has logic. Builds the VM through `@computed`, handles actions, owns local lifecycle.            |
| **Store**      | `auth.store.ts`                                          | App-wide data only (the session nickname).                                                                             |
| **Repository** | `books.repository.ts`                                    | App-wide books data (PM) shared by the list and the header. Validates DTOs, maps them to models, tracks loading state. |
| **Gateway**    | `books.gateway.ts` → `shared/api/generated/books.api.ts` | Transport only. It calls the generated API functions and returns raw DTOs.                                             |

```
src/
  app/                 app shell: app.view/controller, header/ (application-wide sticky header)
  features/
    auth/              auth.store, login.form, login.controller, login.view
    books/             dto, model, gateway, repository, books.list (controller/view), book.add (controller/view/form)
  shared/              reusable, feature-agnostic code
    api/               orval output, axios mutator, error messages
    di/                ContainerProvider + useController (controller lifecycle)
    mobx/              Controller base class, AsyncState
    validation/        FormBase, validateModel, plainToModel (class-validator / class-transformer)
    storage/           AppStorage (localStorage wrapper)
    ui/                dumb UI primitives: Button, TextInput, Form, Tabs, StatusLine, Show
  test/                test helpers: in-memory fake gateway, deferred promises
```

### Key decisions

- **DI with tsyringe.** Controllers are `@injectable()` (a new instance per component). Stores and the repository
  are `@singleton()`. Dependencies are resolved from constructor types through `emitDecoratorMetadata`.
  Vite's default transformer (oxc/esbuild) can't emit decorator metadata, so TypeScript goes through SWC in dev,
  build and tests (`vite.config.ts`).
- **MobX 6 (not 7).** MobX 7 dropped legacy decorators. tsyringe and class-validator/transformer need them, and
  one TypeScript project can't mix both decorator modes.
- **Controller lifecycle.** `useController` resolves the controller once per mounted component, calls
  `init()` on mount and `dispose()` on unmount. Reactions are registered through `autoDispose` and torn down
  on dispose. `init` and `dispose` may run more than once, so the app also works under React `StrictMode`.
- **Async and render hygiene.** `AsyncState.run()` applies a successful result and the status change in one
  `runInAction`. The latest run wins: a stale response, such as one from a quick All → Private switch, is
  dropped. VMs are `@computed`, so equal values don't trigger re-renders. Lists are `observable.shallow`.
  Tests assert the exact number of VM changes per load and per refresh.
- **No logic in TSX.** Conditional rendering goes through `Show` (a `.ts` primitive that receives a boolean from
  the controller). DOM events are turned into plain values in `shared/ui/dom.events.ts`. Tabs receive ready-made
  `select()` callbacks from the VM.
- **Validation** is declarative and uses class-validator on observable form models (`LoginForm`, `BookAddForm`)
  and on API records (`BookModel`). A field's error appears once the field has been edited or a submit was
  attempted.
- Nicknames are lower-cased, so "Appako" and "appako" open the same shelf.

## Tests

`npm test` runs Vitest with jsdom. Controllers, stores and the repository are wired by the real DI container. Only
the network edge is replaced, by an in-memory `FakeBooksGateway` that reproduces the observed API behaviour.

| Area           | Covered                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| AsyncState     | status transitions, errors, latest-wins, reset of in-flight runs                                                                    |
| Controller     | disposers run once and the controller can be initialised again (StrictMode)                                                         |
| FormBase       | errors shown after a field is edited or a submit is attempted, reactive re-validation                                               |
| AuthStore      | login and logout, session restored after a reload                                                                                   |
| Login          | nickname validation messages, lower-casing                                                                                          |
| Repository     | DTO → model mapping and keys, malformed records skipped, non-array response, add + refresh, clear + refresh, reset                  |
| Books list     | "Author: Name" rows, tabs are mutually exclusive, race condition, error + retry, rows kept while refreshing, dispose, render counts |
| Add book       | validation, whitespace-only values, trimmed payload, double-submit guard, error keeps the input                                     |
| Header and App | counter loading and update after add, clear: disabled state, confirm/cancel, refresh, error; logout, data reset on logout           |
| `AppView`      | one RTL smoke test of the whole flow: login → list → add → counter → Private tab → clear                                            |

## API notes

The published OpenAPI spec is kept unchanged in [`api/openapi.yaml`](api/openapi.yaml). It was copied from the
Swagger UI page, because no JSON/YAML spec is served. The spec is incomplete, so the client can't rely on it
alone:

- Every request and response schema is a bare `type: object`. The generated client is therefore untyped, the DTOs
  in `books.dto.ts` were written from real responses, and records are validated at runtime.
- `GET /v1/books/{user}/` and `/private` are described as objects but return arrays.
- Records may come without an `id`. Those records get a position-based React key.
- `POST /v1/books/{user}/` accepts any body, including `{}`, and stores it as is. That's why the client
  validates the form and skips malformed records when reading.
- The original sample posted to `/v1/books/{user}/books`, which returns `404`. The spec path `/v1/books/{user}/`
  is used instead.
- `PUT /v1/books/{user}/reset` has the description "Add new", copied from POST, but it actually deletes the books
  the user added. The seed books stay.
- Every new user starts with three shared seed books (`ownerId: "postnikov"`). "Private" lists only the books
  that user added.
