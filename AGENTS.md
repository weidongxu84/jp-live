# AGENTS.md

When write markdown, be concise.

## Project purpose

This repository collects and organizes **live event information** (concerts, gigs,
tours, one-man lives, fan meetings, appearances) from **Japanese artists** —
singers, voice actors/actresses (声優), and bands — that take place in a **specific
city**.

**Current target:** Hong Kong, in **August 2026**.

The goal is to make it easy for fans to discover which Japanese artists are
performing in the target city during the target period, with accurate and
well-sourced details.

## Scope

- **Artists:** Japanese singers, voice actors/actresses (声優), and bands.
- **City:** Hong Kong (current target; the structure should allow other cities later).
- **Period:** August 2026 (current target; the structure should allow other periods later).
- **Event types:** concerts, live tours, one-man lives, joint lives/festivals,
  fan meetings, talk/appearance events, and similar.

## Data conventions

When adding or editing an event entry, aim to capture the following fields:

- **artist** — Official artist/band name. Prefer the commonly used romanized name,
  and include the Japanese name (日本語表記) when available.
- **artist_type** — one of: `singer`, `voice_actor`, `band`.
- **event_title** — Official title of the live/tour/event.
- **date** — Event date in `YYYY-MM-DD` (use local Hong Kong time / HKT).
- **time** — Start time (and door open time if known), HKT.
- **venue** — Venue name and area/district in Hong Kong.
- **city** — `Hong Kong`.
- **ticket_info** — Price tiers, on-sale date, and ticketing platform/link.
- **source** — URL(s) to the official announcement or authoritative source.
- **status** — one of: `announced`, `confirmed`, `on_sale`, `sold_out`,
  `postponed`, `cancelled`.
- **notes** — Anything else relevant (supporting acts, age limits, etc.).

## Guidelines for agents

- **Accuracy first.** Every event should be backed by a **source URL** (official
  site, official social media, or the ticketing platform). Do not invent events,
  dates, venues, or prices.
- **Cite sources.** Always record where information came from so it can be verified
  and updated.
- **Prefer official sources** over aggregators or unverified social posts. When only
  an unofficial source is available, mark the entry `status: announced` and note the
  uncertainty.
- **Dates and times use Hong Kong local time (HKT, UTC+8).**
- **Keep names consistent.** Use the same romanization for a given artist across
  entries; include the Japanese name for disambiguation.
- **Stay in scope.** Only include events matching the current target city and period
  unless explicitly asked to expand scope.
- **Deduplicate.** Before adding an event, check whether it already exists (same
  artist + date + venue).
- **Note changes.** When an event is postponed, cancelled, or sells out, update its
  `status` rather than deleting the entry, and keep the source link.

## Adding a new city or period

The current focus is Hong Kong / August 2026, but the data structure and conventions
above are intended to generalize. When expanding scope, keep `city`, `date`, and
`source` explicit so entries remain unambiguous across cities and periods.

## How to save findings

- Save all collected information as **Markdown (`.md`)** files.
- Event datasets live under `events\` named `YYYY-MM-<city>.md`
  (e.g. `events\2026-08-hong-kong.md`).
- The collection methodology lives in `COLLECTION_PLAN.md`.
- Record **important, durable** facts (scope, conventions, key sourcing lessons) here
  in **`AGENTS.md`** so they persist across tasks.

## Key sourcing lesson

Mainstream English/Chinese concert aggregators (and general web search) skew toward
**arena-scale pop/rock** and repeatedly **miss smaller anisong / seiyuu (声優)
livehouse shows**. Those smaller shows are almost always listed first on **HK
ACG event-listing platforms** — poll these as the **primary discovery channel**:
- **art-mate.net** — HK arts/ACG listings (browse 音樂 / ACG categories),
- **timable.com** — HK event calendar,
- **ACGEvent.com** — HK ACG live-event news,
- **shadowzo.com** — HK ACG news.

**Second lesson (learned 2026-07):** shows in the `announced` state — date/venue set but
tickets **not yet on sale** — are missed by ticketing-platform and general-web searches.
They break first on **ACG-news feeds, eventernote, and 巴哈姆特 per-anime boards**, and are
often framed around the **anime IP** rather than the act (e.g. *Girls Band Cry* →
トゲナシトゲアリ). Search by hot anime IP too, and record such finds as `announced`
(ticket info TBA) instead of skipping them.

Then verify each against the official/ticketing page:
- **Artist official sites** (LIVE/SCHEDULE pages, e.g. true-singer.com, novelbright.jp),
- **eventernote.com** / **LiveFans** (per-artist Japanese live databases),
- **Ticketing:** UUTIX (uutix.com), KKTIX organizer subdomains (e.g. `edproduction.kktix.cc`),
  Cityline, Ticketflap, Neon Lit, bilibili 会员购,
- **Niche JP-live promoters** in HK (ED Production, Neon Lit, EUPHORIC PRODUCTION,
  Sunny Side Up),
- Small **livehouses** (PORTAL / The Burrow, MOM Livehouse, TIDES) and mid venues
  (MacPherson Stadium, Regal/Dorsett hotel ballrooms).

