const sources = [
  { file: "2026-08-hong-kong.md", id: "august", label: "August 2026" },
  { file: "2026-09-hong-kong.md", id: "september", label: "September 2026" },
  { file: "2026-10-hong-kong.md", id: "october", label: "October 2026" },
  { file: "2026-11-hong-kong.md", id: "november", label: "November 2026" },
];

const text = (value) => value.replace(/\s+/g, " ").trim();
const escapeHtml = (value) => value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);

function field(block, name) {
  const match = block.match(new RegExp(`- \\*\\*${name}:\\*\\*([\\s\\S]*?)(?=\\n- \\*\\*|$)`));
  return match ? text(match[1].replace(/\*\*/g, "")) : "";
}

function eventsFromMarkdown(markdown) {
  const confirmed = markdown.split("## Confirmed events")[1]?.split("## Watchlist")[0] || "";
  return [...confirmed.matchAll(/(?:^|\n)### \d+\. ([^\n]+)\n([\s\S]*?)(?=\n### \d+\.|\s*$)/g)].map((match) => {
    const block = match[2];
    return {
      heading: text(match[1]),
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
  return `<article id="event-${event.id}" class="event">
    <div class="event__topline"><span class="event__date">${escapeHtml(event.date)}</span><span class="status status--${escapeHtml(statusClass)}">${escapeHtml(event.status)}</span></div>
    <h3>${escapeHtml(event.heading)}</h3>
    <p class="artist">${escapeHtml(event.artist)}</p>
    ${event.time ? `<p><strong>Time</strong><br>${escapeHtml(event.time)}</p>` : ""}
    <p><strong>Venue</strong><br>${escapeHtml(event.venue)}</p>
    <p><strong>Tickets</strong><br>${escapeHtml(event.ticket)}</p>
    <ul class="sources">${sourceLinks}</ul>
  </article>`;
}

function eventDates(event) {
  return [...event.date.matchAll(/\d{4}-\d{2}-(\d{2})/g)].map((match) => Number(match[1]));
}

function calendarMonth(page) {
  const firstDate = page.events.flatMap(eventDates)[0];
  const year = Number(page.events.find((event) => event.date.includes("2026"))?.date.slice(0, 4));
  const month = Number(page.events.find((event) => event.date.includes("2026"))?.date.slice(5, 7));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const eventsByDay = new Map();
  page.events.forEach((event) => eventDates(event).forEach((day) => {
    const events = eventsByDay.get(day) || [];
    events.push(event);
    eventsByDay.set(day, events);
  }));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const emptyDays = Array.from({ length: firstWeekday }, () => '<div class="calendar__day calendar__day--empty" aria-hidden="true"></div>');
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const events = (eventsByDay.get(day) || []).map((event) => {
      const statusClass = event.status.toLowerCase().replace(/\s+/g, "-");
      return `<a class="calendar__event calendar__event--${escapeHtml(statusClass)}" href="#event-${event.id}" data-event-link>${escapeHtml(event.artist.split("(")[0].trim())}</a>`;
    }).join("");
    return `<div class="calendar__day"><span class="calendar__date">${day}</span>${events}</div>`;
  });
  return `<section id="${page.id}-calendar" class="month month--calendar">
    <div class="month-heading"><h2>${page.label}</h2><span class="data-updated">Data updated: ${page.updated}</span></div>
    <div class="calendar" role="grid" aria-label="${page.label} event calendar">${weekdays.map((day) => `<div class="calendar__weekday" role="columnheader">${day}</div>`).join("")}${emptyDays.join("")}${days.join("")}</div>
  </section>`;
}

function setView(view) {
  document.body.dataset.view = view;
  document.querySelectorAll(".view-switch__button").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
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
      return { ...source, updated, events: eventsFromMarkdown(markdown).map((event, index) => ({ ...event, id: `${source.id}-${index}` })) };
    }));
    const count = pages.reduce((total, page) => total + page.events.length, 0);
    document.querySelector("#event-count").textContent = count;
    target.innerHTML = pages.map((page) => `<section id="${page.id}" class="month month--list">
      <div class="month-heading"><h2>${page.label}</h2><span class="data-updated">Data updated: ${page.updated}</span></div>
      <div class="event-grid">${page.events.map(eventCard).join("")}</div>
    </section>${calendarMonth(page)}`).join("");
    status.textContent = "";
  } catch (error) {
    status.textContent = "The event data could not be loaded. Please try again shortly.";
    console.error(error);
  }
}

document.querySelectorAll(".view-switch__button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.addEventListener("click", (event) => {
  if (event.target.matches("[data-event-link]")) setView("list");
});

loadSite();