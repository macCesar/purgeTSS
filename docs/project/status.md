# Status — 2026-09-03

**Phase:** v7.16.2 released; Classic video series published and production workspace migrated
**Session by:** Codex · GPT-5
**Branch:** `main`
**Repository state:** release changes committed on `main`; `demos/` has been removed after its verified migration

## Where things stand

PurgeTSS v7.16.2 makes generated custom-font modules expose every processed TTF/OTF family, including text-only collections, and prevents Classic `shades` and `color-module` runs from creating unrelated empty source folders. The release keeps the tutorial-production workspace outside source control.

Episodes `01-brand` through `08-purgetss-module` have final MP4, selectable English SRT, publishing metadata, and reproducible production files under `/Users/cesar/Developer/openSource/purgetss-classic-apps/videos/<slug>/`. The ignored local `videos/` tree lives beside the tracked `projects/` fixtures, so recorder-relative paths keep working while GitHub receives only the examples and public documentation.

`06-icon-library` was accepted and uploaded to YouTube as `MUr4pkUVdOU`. It is processed, public, in playlist `PLBgzic3Fjodc`, and its English caption track is serving. `07-build-fonts` was uploaded as `aCOWlH4LOOE`; it is processed, public, in the same playlist, and its English caption track is serving. The corrected English caption files for episodes 01 through 05 were uploaded over their existing tracks; those five videos remain public and processed.

All eight horizontal masters were also uploaded to TikTok. TikTok accepted the landscape format and exposes its native full-screen control. TikTok Studio Web does not import the external SRT files, so those uploads rely on TikTok's caption workflow instead of the selectable tracks used on YouTube.

The 06 recorder expands only `Resources/fonts/`, showing the three generated Font Awesome TTF filenames without opening a font preview. Its Classic runtime uses `require('lib/fontawesome')` and proves Solid, Regular, and Brands on an iPhone 17 Pro simulator. The recorder also boots and warms the simulator in the background, terminates the disposable app before capture, and activates Simulator only for the scheduled runtime proof.

The reusable technical-video skill now documents background simulator preparation, supports replacing an existing YouTube caption track through `captions.update`, and requires a normalized YouTube delivery master before a preview can become `<slug>-final.mp4`. The new quality gate checks CFR, bitrate, H.264 High Profile, yuv420p, BT.709, AAC/48 kHz, and MP4 fast start.

## In flight

- `07-build-fonts` is finalized and uploaded with its measured ElevenLabs audio, external English SRT, publishing metadata, reproducible accepted take, cue sheet, and validated 4K YouTube master. The CLI, tests, official docs, TiTools source skill, fixture, and recording plan include the corrected normal-font family exports. The final edit uses the iPhone 17 Pro on iOS 26.5, removes passive build time, starts the intact final narration paragraph at `01:09` with the visible `ti build` typing, preserves its original volume, and holds the finished interface after narration.
- `07-build-fonts` is now public. No visibility decision remains.
- `08-purgetss-module` now has a polished portrait Titanium Classic fixture named Motion Lab. The pristine source contains `Resources/app.js` and `Resources/semantic.colors.json`, but intentionally does not contain `Resources/lib/purgetss.ui.js`; `purgetss module` creates that output in the working copy.
- Motion Lab demonstrates `sequence`, `pulse`, `shake`, `transition`, `draggable`, `detectCollisions`, `snapTo`, and `Appearance.init/get/set/toggle`. Its visible appearance control now preserves the real first-run `SYSTEM` mode and cycles `SYSTEM → LIGHT → DARK → SYSTEM`. Android theme changes recreate the Activity, so the app distinguishes that transient lifecycle event from a final window close and keeps its controls active; recording actions must still allow the repaint to finish between selections. It keeps explicit animation durations, initializes drag only after the DRAG panel has visible geometry, and removes drag listeners on a genuine close.
- All eight initial Classic fixtures now enable the iOS Launch Screen storyboard. Stable processed copies live at `/Users/PurgeTSS/01-brand` through `/Users/PurgeTSS/08-purgetss-module`; recording copies must continue to use short random suffixes and remain disposable.
- `08-purgetss-module` was finalized from approved take 02 and uploaded to YouTube as `f3-OiPASRp8`. Its permanent recorder uses a fresh disposable copy, controls Motion, Layout and Appearance, then hands off one continuous bounded drag to the presenter before holding `Snapped to BUILD`. The video is public, belongs to playlist `PLBgzic3Fjodc`, its English caption track is serving, and YouTube finished processing the complete 1:46 upload through 4K.
- Keep the existing YouTube upload of `05-color-module` unchanged so its URL, views and comments remain attached. A future corrected master that ends on the compiled purple palette screen is optional for later platforms or a supplemental video; YouTube cannot replace the uploaded media in place.
- Episodes 01 through 06 need their delivery masters regenerated later from the best available raw capture and reproducible edit, using the same 4K/CFR 30/H.264 High/BT.709/AAC 48 kHz/fast-start gate as episode 07. Never obtain these replacements by transcoding the already compressed final MP4 merely to raise its nominal bitrate; preserve each approved edit and verify it again before any replacement upload.
- The public example repository is `https://github.com/macCesar/purgetss-classic-apps`. Its tracked `projects/` directory contains all eight clean starting fixtures; its local ignored `videos/` directory contains the matching production packages. All eight permanent recorders pass `--check` from the new location.
- The old ignored `demos/` tree has been removed from PurgeTSS. The migrated production workspace contains eight final MP4 files, eight SRT files, eight metadata documents, eight `production/` directories, recording guides, and voice samples.
- The generic `technical-demo-videos` source now lives in the AISkills repository with configurable workstation paths and display selection, cross-domain eval specifications, packaging checks, and no dependency on this PurgeTSS repository. It is committed separately from any future AISkills release.
- Vertical 9:16 derivatives remain an optional future experiment for Shorts and Reels, not a pending requirement for TikTok; the horizontal masters have already been accepted there.

## Next step

Regenerate episodes 01 through 06 from their best source captures when a uniform delivery-master refresh is desired. Keep the current YouTube uploads unchanged unless a separate replacement/publication decision is made.

## Verified vs. assumed

- Verified: `06-icon-library-final.mp4` is H.264/AAC and 84.485 seconds long.
- Verified: the 06 recipe is finalized/synchronized; the approved narration text hash remained unchanged.
- Verified through YouTube Data API: episodes 01–05 are public and processed; their corrected English caption tracks are `serving` and not drafts.
- Verified through YouTube Data API: episode 06 is processed, public, present in playlist `PLBgzic3Fjodc`, and its English caption track is `serving` and not a draft.
- Verified by the user in YouTube Studio: episode 07 is public. Its title, English description with ElevenLabs attribution, 15 tags, Science & Technology category, English language, standard license, embedding, and not-made-for-kids declaration were applied.
- Verified: disposable recording copies were removed and no font-preview extension remains installed. Only the eight deliberately persistent sample copies remain under `/Users/PurgeTSS`.
- Verified: the updated uploader and 06 recorder compile with Python; JSON and JavaScript source checks passed.
- Verified: Poppins Light through Bold, Lora Regular through SemiBold, and ILI have valid PostScript metadata; both text families include their SIL OFL license files.
- Verified: the exact 07 command copied nine native fonts, generated the `ili`-prefixed CommonJS lookup, and created no Alloy/TSS outputs.
- Verified: the corrected generated module exposes every Poppins and Lora weight plus ILI through `families`, while retaining `icons.ili`; the full PurgeTSS test suite and ESLint pass.
- Verified: the official documentation builds and the TiTools source skill test suite passes after documenting the corrected font-module contract.
- Verified: the corrected 07 audio keeps paragraph 5 as one continuous source segment at its original level, beginning at `01:09` with the visible `ti build` typing. Its measured mean level is within `0.1 dB` of the preceding paragraph, with no gain or normalization applied.
- Verified: `07-build-fonts-final.mp4` is 3840×2160 CFR 30 FPS, H.264 High/yuv420p at approximately 34.93 Mbps, BT.709, AAC 48 kHz, fast-start enabled, and 88.133 seconds long. The finished app remains visible for approximately 12.8 seconds, including roughly 3.1 seconds after narration.
- Verified: `08-purgetss-module-final.mp4` is 3840×2160 CFR 30 FPS, H.264 High/yuv420p at approximately 34.93 Mbps, BT.709, AAC mono at 48 kHz, fast-start enabled, and 105.226 seconds long. The approved take ends on `Snapped to BUILD`; its disposable project was removed.
- Verified through YouTube Data API and YouTube's published format listing: episode 08 is public as `f3-OiPASRp8`, appears once in playlist `PLBgzic3Fjodc`, its English caption track is `serving` and not a draft, processing succeeded, the complete duration is 1:46, and renditions are available through 3840×2160 at 30 FPS.
- Verified through YouTube Data API: all eight remote descriptions include `elevenlabs.io` and exactly match their local upload manifests; no metadata update remains pending.
- Verified by the user: all eight horizontal masters were uploaded to TikTok. The first upload preview displayed TikTok's native `Full screen` control and `Everyone` visibility. TikTok caption generation and correction were not independently verified from this session.
- Audited: episodes 01 through 06 are all 3840×2160 with BT.709 and retain their original high-resolution screen captures, but they predate the uniform delivery gate added for 07. Their container FPS/profile/audio/bitrate settings therefore vary; do not transcode those already compressed finals merely to inflate their nominal bitrate.
- Verified: the redesigned 07 Classic app compiled with Titanium SDK 13.4.1.GA and rendered both text families, five visible Poppins weights, and four ILI icons on the iPhone 17 Pro simulator.
- Verified: all eight processed Classic sample projects compile, install, and launch on the iPhone 17 Pro simulator with iOS 26.5 and on the physical Android `CPH2639` device. Their launch screens and runtime screens were captured for visual inspection.
- Verified: Motion Lab fills the modern iPhone display, renders correctly in light and dark appearance on iOS and Android, runs its sequence and layout transition, and completes collision detection plus `snapTo` on Android without JavaScript exceptions.
- Verified after the user's final `Resources/app.js` formatting pass: a fresh disposable copy generated only `Resources/lib/purgetss.ui.js`, compiled with Titanium SDK 13.4.1.GA, and ran Motion, transformed/restored Layout, collision plus `snapTo`, and the three-state appearance cycle on the iPhone 17 Pro and physical Android device.
- Verified: a clean iOS install opens Motion Lab with the visible `SYSTEM` state. On the physical Android device, the corrected appearance control completed `SYSTEM → LIGHT → DARK → SYSTEM → LIGHT` and then another `LIGHT → DARK → SYSTEM`, repainted every semantic color, and remained interactive after each native Activity recreation; the user independently observed `SYSTEM` on the Android first run.
- Verified on a real `04-shades` fragment: the new master normalizer produced 3840×2160 H.264 High Profile at constant 30 FPS, approximately 30 Mbps, yuv420p/BT.709, AAC at 48 kHz, and fast start; temporary test media was removed.
- Verified: `macCesar/purgetss-classic-apps` is public on GitHub with the eight fixtures under `projects/`, while `/videos/` is ignored locally. All fixture XML and JavaScript files validate, and all eight permanent recorders resolve the new paths and pass `--check`.
- Verified: migration preserved all 190 original series files before duplicate project copies and Finder metadata were separated; the final colocated `videos/` workspace is 1.1 GB with all eight final MP4/SRT/metadata sets and eight production directories.
