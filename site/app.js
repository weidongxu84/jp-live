const sources = [
  { file: "2026-08-hong-kong.md", id: "august", label: "August 2026" },
  { file: "2026-09-hong-kong.md", id: "september", label: "September 2026" },
  { file: "2026-10-hong-kong.md", id: "october", label: "October 2026" },
];

const text = (value) => value.replace(/\s+/g, " ").trim();
const escapeHtml = (value) => value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);

function field(block, name) {
  const match = block.match(new RegExp(`- \\*\\*${name}:\\*\\*([\\s\\S]*?)(?=\\n- \\*\\*|$)`));
  return match ? text(match[1].replace(/\*\*/g, "")) : "";
}

function eventsFromMarkdown(markdown) {
  const confirmed = markdown.split("## Confirmed events")[1]?.split("## Watchlist")[0] || "";
  return [...confirmed.matchAll(/^### \d+\. ([\s\S]*?)(?=^### \d+\.|\s*$)/gm)].map((match) => {
    const block = match[1];
    return {
      heading: text(block.split("\n")[0]),
      artist: field(block, "artist"),
      date: field(block, "date"),
      time: field(block, "time"),
      venue: field(block, "venue"),
      ticket: field(block, "ticket_info"),
      status: field(block, "status"),
      source: field(block, "source"),
    };
  });
}

function eventCard(event) {
  const sourceLinks = [...event.source.matchAll(/https?:\/\/[^\s)]+/g)].map((match, index) =>
    `<li><a href="${escapeHtml(match[0])}" target="_blank" rel="noreferrer">Source ${index + 1}</a></li>`
  ).join("");
  const statusClass = event.status.toLowerCase().replace(/\s+/g, "-");
  return `<article class="event">
    <div class="event__topline"><span class="event__date">${escapeHtml(event.date)}</span><span class="status status--${escapeHtml(statusClass)}">${escapeHtml(event.status)}</span></div>
    <h3>${escapeHtml(event.heading)}</h3>
    <p class="artist">${escapeHtml(event.artist)}</p>
    ${event.time ? `<p><strong>Time</strong><br>${escapeHtml(event.time)}</p>` : ""}
    <p><strong>Venue</strong><br>${escapeHtml(event.venue)}</p>
    <p><strong>Tickets</strong><br>${escapeHtml(event.ticket)}</p>
    <ul class="sources">${sourceLinks}</ul>
  </article>`;
}

async function loadSite() {
  const target = document.querySelector("#months");
  const status = document.querySelector("#site-status");
  try {
    const pages = await Promise.all(sources.map(async (source) => {
      const response = await fetch(`events/${source.file}`);
      if (!response.ok) throw new Error(`Could not load ${source.label}`);
      const markdown = await response.text();
      const updated = markdown.match(/Last updated:\s*([0-9-]+)/)?.[1] || "Unknown";
      return { ...source, updated, events: eventsFromMarkdown(markdown) };
    }));
    const count = pages.reduce((total, page) => total + page.events.length, 0);
    document.querySelector("#event-count").textContent = count;
    target.innerHTML = pages.map((page) => `<section id="${page.id}" class="month">
      <div class="month-heading"><h2>${page.label}</h2><span class="data-updated">Data updated: ${page.updated}</span></div>
      <div class="event-grid">${page.events.map(eventCard).join("")}</div>
    </section>`).join("");
    status.textContent = "";
  } catch (error) {
    status.textContent = "The event data could not be loaded. Please try again shortly.";
    console.error(error);
  }
}

loadSite();