const roadmap = [
  { week: "01—02", title: "Core foundations", description: "Get fluent with the building blocks that power interview problems.", topics: ["Big O", "Arrays & strings", "Hash maps", "Prefix sums"], status: "IN PROGRESS" },
  { week: "03—04", title: "Essential patterns", description: "Learn to recognize structure and shrink the search space.", topics: ["Two pointers", "Sliding window", "Binary search", "Intervals"], status: "UP NEXT" },
  { week: "05—06", title: "Data structures", description: "Choose the right structure for the job and explain the trade-offs.", topics: ["Linked lists", "Stacks & queues", "Trees", "Heaps"], status: "UP NEXT" },
  { week: "07—08", title: "Graphs & recursion", description: "Explore connected data, branching choices, and traversal.", topics: ["BFS & DFS", "Backtracking", "Topological sort", "Union Find"], status: "UP NEXT" },
  { week: "09—10", title: "Advanced algorithms", description: "Build confidence with optimization and multi-step reasoning.", topics: ["Dynamic programming", "Greedy", "Shortest paths", "Monotonic stack"], status: "UP NEXT" },
  { week: "11—12", title: "Interview practice", description: "Bring it together with timed sessions and clear communication.", topics: ["Mixed practice", "Mock interviews", "Complexity", "System design basics"], status: "UP NEXT" },
];

const stateKey = "patternPractice.v1";
const defaultState = { currentView: "overview", currentStep: 0, approach: "", code: "", attempted: false, completed: false };
let state;

try {
  state = { ...defaultState, ...JSON.parse(localStorage.getItem(stateKey) || "{}") };
} catch {
  state = { ...defaultState };
}

function saveState() {
  try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch { /* The lesson still works if storage is unavailable. */ }
}

const views = ["overview", "roadmap", "practice"];
const viewNames = { overview: "Overview", roadmap: "Roadmap", practice: "Lesson 01" };

function showView(name) {
  if (!views.includes(name)) return;
  state.currentView = name;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${name}-view`));
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === name));
  document.querySelector("#breadcrumb-current").textContent = viewNames[name];
  document.querySelector(".sidebar").classList.remove("open");
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showStep(index) {
  const step = Math.max(0, Math.min(2, Number(index)));
  state.currentStep = step;
  document.querySelectorAll("[data-step-panel]").forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.stepPanel) === step));
  document.querySelectorAll(".step-link").forEach((button) => button.classList.toggle("active", Number(button.dataset.step) === step));
  saveState();
}

function renderRoadmap() {
  const progress = state.completed ? Math.round(100 / 12) : 0;
  document.querySelector(".roadmap-progress-ring").innerHTML = `${progress}<span>%</span>`;
  document.querySelector(".sidebar-progress .progress-top span:last-child").textContent = `${progress}%`;
  document.querySelector(".sidebar-progress .progress-track span").style.width = `${progress}%`;
  const list = document.querySelector("#roadmap-list");
  list.innerHTML = roadmap.map((stage, index) => {
    const current = index === 0;
    const status = state.completed && index === 0 ? "COMPLETE" : stage.status;
    const topics = stage.topics.map((topic) => `<span>${topic}</span>`).join("");
    return `<article class="roadmap-item ${current ? "current" : ""}">
      <div class="roadmap-week">WEEK<b>${stage.week}</b></div>
      <div class="roadmap-copy"><h2>${stage.title}</h2><p>${stage.description}</p><div class="roadmap-problems">${topics}</div></div>
      <span class="stage-state">${status}</span>
    </article>`;
  }).join("");
}

document.querySelectorAll("[data-view]").forEach((control) => control.addEventListener("click", () => showView(control.dataset.view)));
document.querySelectorAll("[data-next-step]").forEach((control) => control.addEventListener("click", () => showStep(control.dataset.nextStep)));
document.querySelectorAll(".step-link").forEach((control) => control.addEventListener("click", () => showStep(control.dataset.step)));

const approachInput = document.querySelector("#approach-input");
const codeInput = document.querySelector("#code-input");
const saveStatus = document.querySelector("#save-status");
const feedback = document.querySelector("#attempt-feedback");
approachInput.value = state.approach;
codeInput.value = state.code;
approachInput.addEventListener("input", () => { state.approach = approachInput.value; saveState(); });
codeInput.addEventListener("input", () => { state.code = codeInput.value; saveState(); });

document.querySelector("#attempt-button").addEventListener("click", () => {
  state.approach = approachInput.value;
  state.code = codeInput.value;
  state.attempted = Boolean(state.approach.trim() || state.code.trim());
  saveState();
  saveStatus.innerHTML = '<span class="status-dot"></span> SAVED LOCALLY';
  feedback.classList.remove("error");
  feedback.textContent = state.attempted
    ? "Your attempt is saved in this browser. When you’re ready, share your approach and code for coaching feedback."
    : "Add a few notes or a code attempt first. You can save rough work; it doesn’t need to be perfect.";
  if (!state.attempted) feedback.classList.add("error");
});

document.querySelector("#complete-button").addEventListener("click", (event) => {
  if (!state.attempted) {
    feedback.classList.add("error");
    feedback.textContent = "Try the problem first: write down an approach or start a code attempt, then mark the lesson complete when you’re ready.";
    return;
  }
  state.completed = !state.completed;
  event.currentTarget.textContent = state.completed ? "Lesson complete ✓" : "Mark lesson complete";
  event.currentTarget.classList.toggle("button-primary", state.completed);
  event.currentTarget.classList.toggle("button-secondary", !state.completed);
  feedback.classList.remove("error");
  feedback.textContent = state.completed ? "Nice work showing up for the first challenge. Your progress is saved in this browser." : "Lesson moved back to in progress.";
  saveState();
  renderRoadmap();
});

document.querySelector(".menu-button").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));

showView(views.includes(state.currentView) ? state.currentView : "overview");
showStep(state.currentStep);
renderRoadmap();
if (state.completed) {
  const completeButton = document.querySelector("#complete-button");
  completeButton.textContent = "Lesson complete ✓";
  completeButton.classList.replace("button-secondary", "button-primary");
}
