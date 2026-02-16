---
layout: default
title: "Using Coding Agents"
---

# Using Coding Agents

AI coding assistants like Claude Code, GitHub Copilot, Cursor, Gemini CLI or Codex already know react-admin—they’ve been trained on it. But if you want high‑quality react-admin code (idiomatic, maintainable, and aligned with best practices), you need to guide them.

This page explains how to make your coding agent significantly better at writing react-admin applications.

## React-Admin Documentation on Context7

When an agent needs precise information about a hook or component API, give it direct access to the react-admin documentation via [Context7](https://github.com/upstash/context7#installation).

After installing the Context7 MCP server, reference Context7 and [`/marmelab/react-admin`](https://context7.com/marmelab/react-admin) directly in your prompt. For example:

```txt
Add a form field to edit the author of the post.
use context7 with /marmelab/react-admin
```

This ensures the agent relies on the official docs instead of guessing.

## React-Admin Skill

You can go one step further by adding the official react-admin [skill](https://agentskills.io/):

[react-admin/SKILL.md](https://github.com/marmelab/react-admin/blob/master/.agents/skills/react-admin/SKILL.md)

Follow your agent’s instructions to install the skill in your repository (for example, `.claude/skills/react-admin/SKILL.md` for Claude Code).

Once installed, the agent will automatically apply react-admin best practices when generating code.

For example:

```
In the company detail view, show the list of the contacts of the company.
```

With the skill enabled, the agent will correctly choose `<ReferenceManyField>` and `<DataTable>` to display the related contacts.
