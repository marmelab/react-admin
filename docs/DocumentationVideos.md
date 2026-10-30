---
layout: default
title: "Adding Videos To The Documentation"
---

# Adding Videos To The Documentation

A short video often explains a component better than a long paragraph. This page explains how to generate a demo video of a component with [Claude Desktop](https://claude.ai/download), and how to add it to the documentation.

## Generating The Video

Start the Storybook of the package containing the component (`make storybook` for the react-admin repository), then copy the prompt below in a new Claude Desktop conversation.

**Before sending it, don't forget to:**

- **Attach the files**: the prompt refers to the component file (`[Component].tsx`) and its stories file (`[Component].stories.tsx`). Without them, Claude can only guess what the component does.
- **Replace all the generic texts** listed in [Customizing The Prompt](#customizing-the-prompt).

### Prompt

```text
I want a demo video (Motion, MP4 export) of my React component `[Component]` (package [package], react-admin), to show my clients what it can do.

Audience: developers who integrate react-admin. Favor what the end user sees and interacts with (editing, modes, interactions). Leave out props that only configure things in code, unless their effect is visible on screen.

Sources:
- Component file: [Component].tsx (attached)
- Stories file: [Component].stories.tsx (attached)
- Storybook running locally: [story-url]
  Use Claude in Chrome with the window set to 1280×900, and open stories via iframe.html.

Process — do not create the video yet:
1. Read the component and the stories, and browse the Storybook. List everything that can be demonstrated: props, modes, states, customizations.
2. Test in the Storybook every action you plan to show, and note how it actually renders: what changes on screen, the effect on other panes, any visual glitches.
3. Propose a content plan: 3 to 5 moments, in order. For each: the feature shown, the visible action that triggers it (cursor, click, typing), and its duration.
4. List exhaustively everything you will NOT show (each prop, story, mode or state), with the reason and what it would take to include it.
5. Report the glitches found in step 2.
6. Ask me your questions about the content, one at a time, with options to choose from.
7. Only produce the video once I have approved the plan.

Video constraints:
- Duration: [15 to 20 s]. Readability comes before duration. At least 2.5 s per feature, and the final state stays on screen for at least 1.5 s.
- Each feature is triggered by a visible action, with no explanatory text.
- No music, no titles or captions, no end card.
- On-screen text in English.
- "Live typing" style: text is typed letter by letter.
- Every inserted element is filled with short, meaningful content, never left empty.
- Fidelity: reproduce the actual Storybook rendering, visual glitches included, unless told otherwise.
- Colors: those of the react-admin interface (light grey background, primary blue #1976D2).
- Framing: the component stays fully visible at all times and nothing is cut off, including content added near the end. Moderate zoom, preferably on the whole component.
```

Claude first explores the component and proposes a plan. Answer its questions and validate the plan: it only produces the video afterwards.

## Customizing The Prompt

Replace every text between brackets:

| Placeholder | Example | Description |
| --- | --- | --- |
| `[Component]` | `MarkdownInput` | The component name, in the prompt and in the attached file names |
| `[package]` | `ra-markdown` | The package exporting the component |
| `[story-url]` | `http://localhost:9010/?path=/story/ra-markdown-input--basic` | The URL of the story to start from, copied from your local Storybook |
| `[15 to 20 s]` | `10 to 15 s` | The target duration. Increase it if the component has many features to show |

This prompt is a starting point: don't hesitate to adapt it to your component and to the video you want.

## Downloading The Video

Once Claude has produced the video, open its artifact in Claude Desktop, then click on "Share" > "Export" > "MP4 video".

## Converting MP4 To WebM

The documentation serves both a WebM and an MP4 version of each video. Convert the MP4 file to WebM with [ffmpeg](https://ffmpeg.org/):

```sh
ffmpeg -i my-component.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an my-component.webm
```

## Adding The Video To The Documentation

Copy both files in `docs/img/`, then add the video in the component documentation page:

```html
<video controls autoplay playsinline muted loop>
  <source src="./img/my-component.webm" type="video/webm"/>
  <source src="./img/my-component.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>
```
