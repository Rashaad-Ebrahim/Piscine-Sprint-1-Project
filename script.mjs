// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds } from "./common.mjs";
import { getData, addData } from "./storage.mjs";

// DOM elements
const agendaSection = document.getElementById("agenda-section");
const formSection = document.getElementById("form-section");

const agendaMessage = document.getElementById("agenda-message");
const agendaList = document.getElementById("agenda-list");

const userSelect = document.getElementById("user-select");

window.onload = function () {
  populateUserDropdown();
  setupForm();
  agendaMessage.hidden = true; // This will hide "Agenda not found when page loads and no user is selected"
};

function populateUserDropdown() {
  const users = getUserIds();
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", handleUserSelection);
}
function handleUserSelection() {
  const userId = document.getElementById("user-select").value;
  if (!userId) {
    // Clear any previous agenda
    agendaList.innerHTML = "";

    // hide agenda and form sections
    agendaSection.hidden = true;
    formSection.hidden = true;
    return;
  }

  // Display agenda and form sections
  agendaSection.hidden = false;
  formSection.hidden = false;

  const agenda = getData(userId) || [];
  displayAgenda(agenda);
}

function displayAgenda(agenda) {
  // Clear previous content
  agendaList.innerHTML = "";

  // Filter future dates and sort chronologically
  const now = new Date();
  const futureAgenda = agenda
    .filter((item) => new Date(item.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (futureAgenda.length === 0) {
    // Update this logic to a simpler true/false logic
    // agendaMessage.style.display = "block";
    // agendaList.style.display = "none";

    agendaMessage.hidden = false;
    agendaList.hidden = true;
  } else {
    // agendaMessage.style.display = "none";
    // agendaList.style.display = "block";

    agendaMessage.hidden = true;
    agendaList.hidden = false;

    futureAgenda.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.topic} - ${formatDate(item.date)}`;
      agendaList.appendChild(li);
    });
  }
}

function setupForm() {
  const form = document.getElementById("topic-form");
  const dateInput = document.getElementById("revision-date");

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  form.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const userId = document.getElementById("user-select").value;
  const topicName = document.getElementById("topic-name").value.trim();
  const startDateStr = document.getElementById("revision-date").value;

  if (!topicName || !startDateStr) {
    alert("Please fill in both topic name and date.");
    return;
  }

  const startDate = new Date(startDateStr + "T00:00:00Z"); // UTC midnight
  const revisions = calculateRevisions(startDate, topicName);

  addData(userId, revisions);
  displayAgenda(getData(userId) || []);

  // Reset form
  document.getElementById("topic-name").value = "";
  document.getElementById("revision-date").value = new Date()
    .toISOString()
    .split("T")[0];
}

function calculateRevisions(startDate, topic) {
  const revisions = [];
  const intervals = [
    { days: 7 }, // 1 week from now
    { months: 1 }, // 1 month from now
    { months: 3 }, // 3 months from now
    { months: 6 }, // 6 months from now
    { years: 1 }, // 1 year from now
  ];

  intervals.forEach((interval) => {
    const revisionDate = new Date(startDate);
    if (interval.days) {
      revisionDate.setUTCDate(revisionDate.getUTCDate() + interval.days);
    } else if (interval.months) {
      revisionDate.setUTCMonth(revisionDate.getUTCMonth() + interval.months);
    } else if (interval.years) {
      revisionDate.setUTCFullYear(
        revisionDate.getUTCFullYear() + interval.years
      );
    }
    revisions.push({ topic, date: revisionDate.toISOString().split("T")[0] });
  });

  return revisions;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(); // Format according to user's local time
}
