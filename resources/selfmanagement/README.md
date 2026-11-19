---
title: "iCanStudy Knowledge Base"
---

# iCanStudy Knowledge Base

A single, deduplicated study reference built from the **entire iCanStudy course** by Dr. Justin Sung — all 17 modules and 34 Live Clinic Q&A sessions in `../resources/`.

## Why this exists

The raw course material is **scattered and duplicated**: the same technique (note-taking, revision, time management, the Bear Hunter System…) is re-taught across several modules, and the Live Clinics re-cover everything again with practical nuance. That makes it hard to know where to look and easy to re-learn the same thing three times.

This KB fixes that by reorganising the knowledge **by concept, not by video**:
·
- **One canonical note per topic.** Every mention of a concept — from any module or clinic — is merged into a single place. You learn it once, completely.
- **Evergreen, atomic notes.** Crisp definitions, principles, precise steps, common mistakes, and practical tips — distilled from the verbose spoken transcripts.
- **Dense cross-links.** Notes link to each other with `[[wiki-links]]` instead of repeating content, so related ideas connect without re-scattering.
- **Full provenance.** Every note lists its source files; the [Source Map](source-map.md) shows where knowledge came from and what was merged or skipped.

This follows the *evergreen notes + Map of Content* approach: concept-oriented atomic notes, navigated through an index.

## How to use it

1. Start at the **[Map of Content](index.md)** — it lists all topics and a suggested learning path.
2. Read a **[topic note](topics/)** end-to-end to learn that subject completely.
3. Follow `[[links]]` to related topics; look up acronyms in the **[Glossary](glossary.md)**.
4. Want the original video? Check the note's **Sources** section or the **[Source Map](source-map.md)**.

> The course is sequential by design — each technique builds on the last. The learning path in the index respects that order. Don't skip ahead; the system only works when the pieces fit together.

## Layout

```
notes/
├── README.md          ← you are here
├── index.md           ← Map of Content (start here)
├── glossary.md        ← acronyms, system names, and their ASR aliases
├── source-map.md      ← provenance, duplication hotspots, skipped files
└── topics/            ← 17 deduplicated evergreen topic notes
    ├── learning-science.md
    ├── bear-hunter-system.md
    ├── aiming.md
    ├── note-taking.md
    ├── chunking-grinde.md
    ├── memorisation.md
    ├── revision.md
    ├── time-management.md
    ├── mindset-emotion.md
    ├── habits-behaviour.md
    ├── exam-technique.md
    ├── focus-attention.md
    ├── professional-learning.md
    ├── decision-making.md
    ├── sleep-rest.md
    ├── giving-back.md
    └── course-guide.md
```

Each topic note has the same shape: a one-line definition → overview → one section per concept (definition, principles, steps, mistakes, tips, examples) → related topics → sources. Clinic-derived tips are tagged `(Clinic N)` so you can find the original session.

## How it was built

Parallel reading agents read every transcript, extracted each distinct concept into a structured staging file (`../.kb-staging/`), and tagged it to a topic. Synthesis agents then merged all extractions per topic into the notes here, deduplicating across modules and clinics. Duplicate exports (`_bi`/`_cn`/`(1)` variants), empty/corrupt captures, and incomplete downloads were skipped — see the [Source Map](source-map.md) for the full list.

## Caveats

- **Source gaps:** a few original files are empty, corrupt, or mis-labelled (e.g. the "Sleep Hygiene" file actually contains an anatomy lecture). These subtopics are thin or absent — flagged in the [Source Map](source-map.md#known-gaps-source-problems-not-extraction-errors).
- **Speech-to-text quirks:** transcripts mis-spell many terms (e.g. WPW → "whole pothole", BHS → "Bayonetta system"). The [Glossary](glossary.md) lists these aliases so you can match them in the raw files.
- **This is a study aid, not a replacement for practice.** The course stresses that understanding a technique ≠ being able to use it. Pair reading with the COBES practice cycle described in [course-guide](topics/course-guide.md).
