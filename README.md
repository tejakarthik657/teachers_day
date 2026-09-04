# Teacher's Day 3D Memory Book — The Memories We Keep

An interactive, commemorative 3D digital tribute album dedicated to an esteemed faculty teacher on the occasion of Teacher's Day.

Built with **Three.js**, **TypeScript**, **Vite**, **HTML5 Canvas**, and **Vanilla CSS**.

---

## Overview & Story Progression

The memory book unfolds as an authentic physical commemorative album placed in a warm library environment with realistic page physics, natural page-bending curves, dynamic lighting, and paper rustle acoustics.

1. **Cover (Page 1)**: *The Memories We Keep — A Teacher's Day Tribute* (Teacher's portrait, commemorative golden crest)
2. **Spread 1 (Pages 1–2)**: *In Grateful Dedication* (Formal Ex Libris bookplate) & *More Than a Teacher* (Faculty portrait & mentor tribute)
3. **Spread 2 (Pages 3–4)**: *Where It All Happened* (Lecture hall & seminar moments) & *Lessons We Will Carry* (Core principles & timeless wisdom)
4. **Spread 3 (Pages 5–6)**: *Moments We Remember* (Campus walks, laughter, breakthroughs) & *Words That Stayed With Us* (Teacher's memorable quotes)
5. **Spread 4 (Pages 7–8)**: *What You Left With Us* (Five Pillars: Confidence, Discipline, Curiosity, Perspective, Belief) & *The People & The Memories* (Class photo album)
6. **Spread 5 (Pages 9–10)**: *From All of Us* (Collective heartfelt student letter) & *Final Thank You* (Grand tribute & stanzas of gratitude)
7. **Spread 6 (Pages 11–12)**: *Commemorative Valediction* (Archival seal) & Archival Endpaper
8. **Back Cover**: Embossed gold crest and commemorative monograph seal

---

## How to Customize Content

All content is centralized and data-driven in:
[`src/data/book-content.ts`](./src/data/book-content.ts)

To customize for your specific faculty member:
1. Open `src/data/book-content.ts`
2. Update the teacher's name, honorific, designation, department, and institution.
3. Drop real photographs into:
   - `public/images/teacher/portrait.jpg` (Faculty portrait)
   - `public/images/classroom/lecture.jpg` (Classroom lecture photo)
   - `public/images/memories/mentorship.jpg` (Seminar / mentorship discussion photo)
   - `public/images/memories/campus.jpg` (Campus courtyard photo)
   - `public/images/group/class-photo.jpg` (Class graduation photo)
4. Re-run or reload! All pages are automatically rendered with crisp high-DPI typography and elegant frames.

---

## Navigation & Controls

- **Turn Pages**: Click on the left/right page edges, drag with mouse / swipe with finger, or use Left/Right arrow keys.
- **Inspect Photographs**: Click on any memory photograph to smoothly zoom in for high-detail view; press `Escape` or click anywhere to return.
- **Table of Contents**: Click the **Chapters (📑)** button in the bottom dock or click the spread title.
- **Sound**: Click the **Audio** button or press `M` to toggle realistic paper turn sounds and calming ambient chords.
- **Fullscreen**: Click the **Fullscreen (⛶)** button or press `F` (or double-click the desk).

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
# ktk
