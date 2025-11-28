# Web Client Block Producer Test

Test reproduction for `PlainMicroBlock.producer` field added in [core-rs-albatross PR](https://github.com/nimiq/core-rs-albatross/pull/3550).

## Setup

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 and wait for consensus. Micro blocks will show the `producer` field:

```json
{
  "slotNumber": 42,
  "validator": "NQ07 ...",
  "publicKey": "abc..."
}
```

## What's patched

The `@nimiq/core` package is patched with wasm built from the PR branch to include the new `producer` field on `PlainMicroBlock`.
