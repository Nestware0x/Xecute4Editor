# Xecute Editor 4

This directory contains the static Xecute Editor. The Bot sends each Editor session as an encrypted PNG attachment instead of placing the full settings payload in the Editor URL.

Host `index.html`, `index.css`, and `index.js` together on an HTTPS static host, then configure the Bot process:

- `XROSS_EDITOR_URL=https://your-static-editor.example/`
- `XROSS_EDITOR_SECRET=<at-least-32-character-shared-secret>`
- `XROSS_EDITOR_ATTACHMENT_TRANSPORT=true`
- `XROSS_EDITOR_ATTACHMENT_CHANNEL_ID=<private Bot management channel ID>`

`/editor` creates `XecuteSession.png` with AES-256-GCM data stored in a lossless PNG carrier. When the private attachment channel is configured, the Bot posts the carrier image there and the Editor URL contains only its media URL and a random decryption key. After obtaining the Discord CDN URL, the Bot deletes the temporary channel message; the generated URL continues to reference the CDN object. URL fragments are not sent to the static host. The browser fetches the image from Discord media, extracts and decrypts the session locally. If automatic loading is unavailable, the same PNG can be selected or dropped into the Editor manually.

The Editor includes only settings changed from the values loaded by `/editor` in its apply payload. Its copy action copies `/apply code:XE4.1...`, ready to paste into Discord and submit. It can also download `XecuteApply.xe4a`. Apply either with `/apply code:` or `/apply file:`. Editor sessions remain signed and server-and-user-bound. For 30 minutes after `/editor` creates the link, the same session can generate and submit `/apply` repeatedly. Signed action payloads such as ServerBuilder remain one-time use.

`/editor` creates a server-settings session containing only guild-scoped definitions. `/user-settings` creates a personal session containing only user-scoped definitions. Both commands open this same static site; the session decides which settings are present, so the page does not expose a server/user switch.

Set `XROSS_EDITOR_ATTACHMENT_TRANSPORT=false` only while an older public Editor is still deployed. This preserves the legacy compressed URL transport until the new static files are published.

The Editor language is fixed when `/editor` creates the server session: it uses that guild's Xross display-language setting. Only that language's label and description are included in the session; the browser contains no plugin-specific text. Plugins can provide localized setting metadata with `label("ja", ...)`, `label("en", ...)`, `description("ja", ...)`, and `description("en", ...)` on `GuildSettingDefinition.Builder`.

Server sessions also include the current guild channel and role cache. `CHANNEL` and `ROLE` settings are rendered as drop-down lists showing name and ID, so administrators do not need to copy IDs. The list is gathered from the `/editor` interaction's guild object and does not issue a separate REST request or select a shard.
