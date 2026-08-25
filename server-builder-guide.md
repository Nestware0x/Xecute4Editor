# Xecute ServerBuilder JSON Guide

Give an AI this page URL together with a description of the Discord community you want. Ask it to return JSON only.

```
Create a Discord community layout using the Xecute ServerBuilder specification.
Return JSON only. Do not include Markdown or explanations.
https://YOUR-EDITOR-HOST/server-builder-guide.md
```

## Version

Set `schemaVersion` to exactly `server-builder/v1`.

## What ServerBuilder creates

- New roles with a name, optional color, display separation, and mentionable flag.
- New categories.
- New `TEXT` and `VOICE` channels.
- Up to three initial plain-text messages for each text channel.
- Visibility restrictions with `visibleToRoles`.

`visibleToRoles` only controls whether a role can view a category or channel. It does not grant administrator, moderation, message, member, or any other permission. When it is present, ServerBuilder hides that item from `@everyone` and allows only the named roles to view it.

## Safety limits

- 1 to 10 categories; 50 channels total.
- 0 to 25 roles.
- 1 to 50 channels per category.
- `TEXT` and `VOICE` are the only channel types.
- Never output Discord permission bitfields, member role assignments, edits to existing channels, or deletion actions.
- Every name in `visibleToRoles` must be declared in the root `roles` array.

## Example

```json
{
  "schemaVersion": "server-builder/v1",
  "roles": [
    { "name": "運営", "color": "#e67e22", "hoisted": true },
    { "name": "メンバー", "color": "#3498db" }
  ],
  "categories": [
    {
      "name": "📌 はじめに",
      "channels": [
        {
          "type": "TEXT",
          "name": "rules",
          "topic": "サーバールール",
          "initialMessages": ["ようこそ！まずルールをご確認ください。"]
        }
      ]
    },
    {
      "name": "🔒 運営",
      "visibleToRoles": ["運営"],
      "channels": [
        { "type": "TEXT", "name": "staff-chat" }
      ]
    }
  ]
}
```

Validate generated JSON against [server-builder.schema.json](server-builder.schema.json) before using it.
