---
name: doc-video
description: Produces a short demo video of a react-admin component for the documentation, using Motion (in Claude Desktop, or as an Artifact type in Claude Code) and the component's Storybook. Use when the user wants a demo video, screencast or animation of a react-admin component, or wants to illustrate a component in the docs with a video.
---

# Generating A Demo Video Of A React-Admin Component

This skill produces a short, silent demo video of a react-admin component, rendered with Motion and exported as MP4, then converted to WebM for the documentation.

## Inputs

The user only names the component (e.g. `FileInput`). Find and read the rest yourself:

- **The component file** (`[Component].tsx`) and **its stories file** (`[Component].stories.tsx`): search `packages/` (excluding `node_modules`). If several components share the name (e.g. a headless one in `ra-core` and a Material UI one in `ra-ui-materialui`), ask which one. If none is found, the component probably belongs to an Enterprise Edition package that is not in this repository: ask the user to attach both files and wait. Without them, you can only guess what the component does.
- **The documentation page**: `docs/[Component].md`, and `docs_headless/` for a headless `ra-core` component. It tells what the component is for, which props matter, and which image or video illustrates it today.
- **The URL of the story to start from** in the user's local Storybook (e.g. `http://localhost:9010/?path=/story/ra-markdown-input--basic`). Derive it before asking: the story id comes from the stories file `title` and the export name (`ra-ui-materialui/input/FileInput` + `Multiple` → `ra-ui-materialui-input-fileinput--multiple`), and the doc page frontmatter has a `storybook_path`. Check that Storybook answers on port 9010; if not, ask the user to start it.
- **The target duration**. Default to 10 to 15 s, longer if the component has many features to show.

Ask for whatever is missing and cannot be derived, one question at a time.

The audience is developers who integrate react-admin. Favor what the end user sees and interacts with (editing, modes, interactions). Leave out props that only configure things in code, unless their effect is visible on screen.

## Process

Do not create the video until the user approves the plan.

1. Read the component, its stories and its documentation page, and browse the Storybook, opening stories via `iframe.html?id=<story-id>&viewMode=story`. Use Claude in Chrome if available, otherwise drive a headless browser with Playwright. List everything that can be demonstrated: props, modes, states, customizations.
2. Test in the Storybook every action you plan to show, and note how it actually renders: what changes on screen, the effect on other panes, any visual glitches.
3. Measure what will be on screen (computed sizes, paddings, font sizes and weights, colors, radii, shadows, icon SVG paths), so the video recreates the UI from real values rather than from screenshots.
4. Propose a content plan: 3 to 5 moments, in order. For each: the feature shown, the visible action that triggers it (cursor, click, typing), and its duration.
5. List exhaustively everything you will NOT show (each prop, story, mode or state), with the reason and what it would take to include it.
6. Report the glitches found in step 2.
7. Ask your questions about the content, one at a time, with options to choose from.
8. Ask the user to confirm the plan. Only produce the video once the user has approved.

## Producing The Video

- **Claude Desktop**: create the video with Motion.
- **Claude Code**: Motion is an Artifact type. List the types with the Artifact tool, create the video from the Motion type, and follow its instructions. The constraints below already answer its style, colors and length questions, so don't ask them again; the video is silent, so it has no score.

Build the component at a width narrower than Storybook's, so the camera can zoom while the whole component stays visible. Tell the user every deviation from the Storybook rendering.

## Video Constraints

- Readability comes before duration. At least 1.5 s per feature, and the final state stays on screen for at least 1.5 s.
- Each feature is triggered by a visible action, with no explanatory text.
- No music, no titles or captions, no end card.
- "Live typing" style: text is typed letter by letter.
- Every inserted element is filled with short, meaningful content, never left empty.
- Fidelity: reproduce the actual Storybook rendering, visual glitches included, unless the user says otherwise.
- Colors: those of the react-admin interface (light grey background, primary blue `#1976D2`).
- Framing: the component stays fully visible at all times and nothing is cut off, including content added near the end.

## Adding The Video To The Documentation

Only Motion's Export produces the MP4 file, so this one step is the user's. Once the video is produced, ask the user to open the video artifact, click on "Share" > "Export" > "MP4 video", and tell you when the download is done. Then do the rest yourself, in a shell when available (otherwise, give the user the steps):

1. Find the newest `.mp4` in `~/Downloads`, and confirm its name and date with the user before using it.
2. Move it to `docs/img/my-component.mp4`, then convert it to WebM (the documentation serves both formats):

   ```sh
   ffmpeg -i docs/img/my-component.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an docs/img/my-component.webm
   ```

3. Add the video in the component documentation page, in place of the existing screenshot if there is one (e.g. `![FileInput](./img/file-input.png)`). Delete the replaced image from `docs/img/` if no other page uses it (search `docs/` for its name):

   ```html
   <video controls autoplay playsinline muted loop>
     <source src="./img/my-component.webm" type="video/webm"/>
     <source src="./img/my-component.mp4" type="video/mp4"/>
     Your browser does not support the video tag.
   </video>
   ```

Replace `my-component` with the kebab-case name of the component (e.g. `markdown-input`).
