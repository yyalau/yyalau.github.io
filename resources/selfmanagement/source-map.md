---
title: "Source Map & Provenance"
---

# Source Map & Provenance

This file records **where every piece of knowledge came from** and **what was skipped or merged**. It exists because the original `resources/` material is scattered across 17 modules and heavily duplicated — the topic notes in [`topics/`](topics/) collapse that scatter, and this map lets you trace any note back to its sources.

- Each topic note also ends with a **Sources** section listing the exact `resources/` files that fed it.
- Raw concept extractions (intermediate, per-cluster) live in `../.kb-staging/` if you want to audit the distillation.

## Module → topic notes

Which topic notes absorb each original module. (Live Clinic feeds **every** topic.)

| Module | Topic notes it feeds |
|---|
| 00-Welcome | course-guide |
| 01-Rapid Start Modules | course-guide, habits-behaviour, learning-science, mindset-emotion, time-management |
| 02-Fundamentals 1 | aiming, bear-hunter-system, course-guide, exam-technique, learning-science, memorisation, note-taking, revision |
| 03-30-day Plan | course-guide, habits-behaviour, time-management |
| 04-Fundamental 2 | aiming, chunking-grinde, course-guide, exam-technique, learning-science, memorisation, note-taking, revision, time-management |
| 05-Briefing | aiming, course-guide, focus-attention, learning-science, mindset-emotion, note-taking, revision, sleep-rest |
| 06-Technique Training | aiming, chunking-grinde, course-guide, learning-science, note-taking, time-management |
| 07-Ascent I | aiming, bear-hunter-system, chunking-grinde, focus-attention, learning-science |
| 08-Ascent II | bear-hunter-system, chunking-grinde, course-guide, exam-technique, learning-science, note-taking |
| 09-Ascent III | bear-hunter-system, chunking-grinde, learning-science |
| 10-Base Camp | bear-hunter-system, chunking-grinde, course-guide, focus-attention, habits-behaviour, learning-science, memorisation, mindset-emotion, time-management |
| 11-Camp I | learning-science, memorisation, revision |
| 12-Camp II | bear-hunter-system, exam-technique, learning-science, memorisation, revision, time-management |
| 13-Summit | bear-hunter-system, course-guide, exam-technique, learning-science, mindset-emotion, revision, sleep-rest |
| 14-Bonus (Higher Ground) | decision-making, focus-attention, habits-behaviour, professional-learning, sleep-rest |
| 15-Live Clinic | **all 17 topics** (practical Q&A insights folded in, tagged `(Clinic N)`) |
| 16-Giving Back | giving-back |

## Topic note → source modules

The reverse view: how widely each topic was originally scattered (this scatter is exactly what the KB deduplicates).

| Topic note | Source modules |
|---|---|
| learning-science | 01, 02, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13 + Clinics |
| course-guide | 00, 01, 02, 03, 04, 05, 06, 08, 10, 13 + Clinics |
| bear-hunter-system | 02, 07, 08, 09, 10, 12, 13 + Clinics |
| revision | 02, 04, 05, 11, 12, 13 + Clinics |
| time-management | 01, 03, 04, 06, 10, 12 + Clinics |
| note-taking | 02, 04, 05, 06, 08 + Clinics |
| chunking-grinde | 04, 06, 07, 08, 09, 10 + Clinics |
| memorisation | 02, 04, 10, 11, 12 + Clinics |
| exam-technique | 02, 04, 08, 12, 13 + Clinics |
| mindset-emotion | 01, 05, 10, 13 + Clinics |
| habits-behaviour | 01, 03, 10, 14 + Clinics |
| focus-attention | 05, 07, 10, 14 + Clinics |
| aiming | 02, 04, 05, 06, 07 + Clinics |
| sleep-rest | 05, 13, 14 + Clinics |
| decision-making | 14 + Clinics |
| professional-learning | 14 + Clinics |
| giving-back | 16 + Clinics |

## Duplication hotspots (now merged)

These topics were taught repeatedly in different modules. The KB merges each into one canonical note:

- **Note-taking** — full treatments in both *04-Fundamental 2* and *08-Ascent II*, plus previews in 02/05/06 → one [note-taking](topics/note-taking.md) note.
- **Revision / rote-learning** — spread across *04* (rote), *11-Camp I* (rote + flashcards), *12-Camp II* (revision/WPW), *13-Summit* (multipass/cramming) → [revision](topics/revision.md) + [memorisation](topics/memorisation.md).
- **Time management** — *01* (rapid), *03* (protecting time), *04* (scheduling), *06* (scheduling), *10* (Priority 0+1, OFF-Rest), *12* (attention/task mgmt) → one [time-management](topics/time-management.md) note.
- **Bear Hunter System** — introduced in *02* preview, taught across *07/08/09* (Aim/Shoot/Skin), varied in *10* (Hipshot), integrated in *12/13* → one [bear-hunter-system](topics/bear-hunter-system.md) note.
- **Focus / distractions** — *05* (must-do), *07* (distractions/focus), *10* (attention), *14* (ADHD hyper-focus) → [focus-attention](topics/focus-attention.md).
- **Live Clinic** — 34 Q&A sessions re-cover the same topics with practical nuance; insights are folded into the relevant topic note rather than kept as 34 separate transcripts.

## Skipped & deduplicated files

### Empty / corrupt captures (no usable content)
- `05-Briefing/1-Introduction/4-Expectations/4-Expectations.md` — 61 bytes; only a failed-capture message.
- `07-Ascent I/06-Aim Examples/6.7-English – Unfamiliar Text/…md` — 92 bytes of repeated "you you you…".
- `10-Base Camp/04-Neuroticism/4.1-Neuroticism_ Prevention/…md` — near-empty/corrupt.
- `12-Camp II/04-Advanced Time-Management Skills/4.1-Task Management/…md` — empty.
- `15-Live Clinic/Live Clinic 43.md` — session outro only (review request + thanks), no teaching content.

### Content mismatch
- `14-Bonus/01. Special Topics/3-Optimal Sleep/3.2-Sleep Hygiene and Guidelines - iCanStudy.md` — **wrong content**: the file contains an unrelated nervous-system anatomy lecture (neurons, glia, synapses), not sleep hygiene. See *Known gaps* below.

### Duplicate content (merged into the base lesson)
- `08-Ascent II/02-Effective Note-Taking/Examples of Note-taking - iCanStudy.md` — near-duplicate of the `2.4-Examples of Note-taking/` version (base used).
- `10-Base Camp/04-Neuroticism/4.4-Neuroticism_ Management/…md` — duplicate content.
- `14-Bonus/02. Learning for professionals/5.1-Microlearning system/…(1).md` — duplicate export of the base file.
- `14-Bonus/03. Optimal Decision Making/` lessons **7.1, 7.2, 7.4, 7.5** — each has `_bi.md` (alternate export) and `_cn.md` (condensed paraphrase) variants of the same lesson; 8 files merged into their base lessons. *(Despite the names, `_cn` is a condensed English paraphrase, not a translation.)*

### Incomplete downloads / 0-byte assets (ignored)
All in `08-Ascent II/02-Effective Note-Taking/2.2-…Processed, Relational, Freehand/`:
- `App and device recommendations…(1).pdf` (0 bytes) and its `.baiduyun.p.downloading` partial.
- `Effective Note-Taking…iCanStudy.mp4` (0 bytes) and its `.mp4.baiduyun.p.downloading` partial (~26 MB, incomplete).
- `Effective Note-Taking…iCanStudy.pdf.baiduyun.p.downloading` (incomplete).
- `References for the power of freehand…pdf` (0 bytes) and its `.downloading` partial.

> The two **usable** PDFs (`App and device recommendations for digital note-taking.pdf`, `Basic references for advantages of freehand.pdf`) and the `.srt` subtitle file **were** read and folded into [note-taking](topics/note-taking.md).

## Known gaps (source problems, not extraction errors)
- **Sleep hygiene** — the dedicated lesson file is mis-labelled (anatomy content), so [sleep-rest](topics/sleep-rest.md) covers sleep from the *Optimal Sleep / Understanding Sleep* lesson and clinic insights only. The "sleep hygiene guidelines" specifics are unavailable in `resources/`.
- **English – Unfamiliar Text (Aim example)** and **Neuroticism: Prevention** and **Task Management** — source files are empty/corrupt, so these subtopics are thin or absent.
- **Truncated exports** — `03-30-day Plan/04-Protecting time` and `02-Fundamentals 1/04-Curriculum Overview/4.1` end mid-sentence in the source itself; captured content stops where the transcript does.
