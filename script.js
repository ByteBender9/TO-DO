const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const STORAGE = "taskflow_v2_tasks";
const CAT_STORAGE = "taskflow_v2_categories";
const THEME_STORAGE = "taskflow_v2_theme";

const defaultCategories = ["Study", "Work", "Personal", "Projects"];
let tasks = JSON.parse(localStorage.getItem(STORAGE) || "[]");
let categories = JSON.parse(localStorage.getItem(CAT_STORAGE) || JSON.stringify(defaultCategories));
let currentView = "all";
let currentCategory = null;
let sortNewest = true;
let draggedId = null;

const today = () => new Date().toISOString().slice(0,10);
const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const save = () => { localStorage.setItem(STORAGE, JSON.stringify(tasks)); localStorage.setItem(CAT_STORAGE, JSON.stringify(categories)); };

function formatDate(date) {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});
}
function isOverdue(t) { return !t.completed && t.dueDate && t.dueDate < today(); }
function isToday(t) { return t.dueDate === today(); }

function updateHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = `${greeting} 👋`;
  $("#dateLabel").textContent = new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
}

function updateStats() {
  const total = tasks.length, completed = tasks.filter(t=>t.completed).length, pending = total-completed;
  $("#completionRate").textContent = total ? Math.round(completed/total*100)+"%" : "0%";
  $("#pendingCount").textContent = pending;
  $("#completedCount").textContent = completed;

  const todayTasks = tasks.filter(isToday);
  const todayDone = todayTasks.filter(t=>t.completed).length;
  const pct = todayTasks.length ? Math.round(todayDone/todayTasks.length*100) : 0;
  $("#todayProgressText").textContent = `${todayDone} / ${todayTasks.length}`;
  $("#todayProgressBar").style.width = pct+"%";

  $("#navAll").textContent = total;
  $("#navToday").textContent = todayTasks.filter(t=>!t.completed).length;
  $("#navUpcoming").textContent = tasks.filter(t=>!t.completed && t.dueDate && t.dueDate > today()).length;
  $("#navOverdue").textContent = tasks.filter(isOverdue).length;
  $("#navCompleted").textContent = completed;
  $("#remainingText").textContent = `${pending} ${pending===1?"task":"tasks"} remaining`;
}

function renderCategories() {
  $("#categoryList").innerHTML = categories.map(c =>
    `<button class="category-btn ${currentCategory===c?"active":""}" data-category="${escapeHTML(c)}"><span class="category-dot"></span>${escapeHTML(c)}</button>`
  ).join("");
  $("#categoryInput").innerHTML = categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $$("#categoryList .category-btn").forEach(btn => btn.onclick=()=>{
    currentCategory = btn.dataset.category;
    currentView = "category";
    $$(".nav-item").forEach(x=>x.classList.remove("active"));
    render();
  });
}

function getVisibleTasks() {
  let list = [...tasks];
  const q = $("#searchInput").value.trim().toLowerCase();

  if (currentView==="today") list=list.filter(isToday);
  if (currentView==="upcoming") list=list.filter(t=>!t.completed && t.dueDate && t.dueDate>today());
  if (currentView==="overdue") list=list.filter(isOverdue);
  if (currentView==="completed") list=list.filter(t=>t.completed);
  if (currentCategory) list=list.filter(t=>t.category===currentCategory);
  if (q) list=list.filter(t=>(t.title+" "+t.description+" "+t.category).toLowerCase().includes(q));

  list.sort((a,b)=>{
    if (a.completed!==b.completed) return a.completed-b.completed;
    if (a.dueDate && b.dueDate && a.dueDate!==b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return sortNewest ? b.createdAt-a.createdAt : a.createdAt-b.createdAt;
  });
  return list;
}

function render() {
  updateStats();
  renderCategories();
  const list=getVisibleTasks();
  $("#taskList").innerHTML=list.map(taskCard).join("");

  const empty=list.length===0;
  $("#emptyState").style.display=empty?"block":"none";
  $("#taskList").style.display=empty?"none":"flex";

  const names={
    all:["All tasks","Everything you need to get done."],
    today:["Today","Your tasks scheduled for today."],
    upcoming:["Upcoming","Tasks scheduled for the days ahead."],
    overdue:["Overdue","Tasks that still need your attention."],
    completed:["Completed","A record of the work you've finished."],
    category:[currentCategory,`Tasks in ${currentCategory}.`]
  };
  $("#viewTitle").textContent=names[currentView][0];
  $("#viewSubtitle").textContent=names[currentView][1];

  $("#emptyTitle").textContent = $("#searchInput").value ? "No matching tasks" : currentView==="completed" ? "No completed tasks" : "Nothing here yet";
  $("#emptyText").textContent = $("#searchInput").value ? "Try another search term." : "Create a task and start making progress.";
}

function taskCard(t) {
  const due = t.dueDate ? formatDate(t.dueDate) : "";
  const dueClass = isOverdue(t) ? "overdue" : "";
  return `<article class="task ${t.completed?"completed":""}" draggable="true" data-id="${t.id}">
    <span class="drag" title="Drag to reorder">⋮⋮</span>
    <button class="check ${t.completed?"checked":""}" data-action="toggle" aria-label="Complete task"></button>
    <div class="task-body">
      <div class="task-title">${escapeHTML(t.title)}</div>
      ${t.description?`<div class="task-description">${escapeHTML(t.description)}</div>`:""}
      <div class="task-meta">
        <span class="pill ${t.priority}">${t.priority}</span>
        <span class="category-pill">• ${escapeHTML(t.category)}</span>
        ${due?`<span class="date ${dueClass}">◷ ${due}${t.dueTime?" · "+escapeHTML(t.dueTime):""}</span>`:""}
      </div>
    </div>
    <div class="task-actions">
      <button class="edit" data-action="edit" title="Edit">✎</button>
      <button class="delete" data-action="delete" title="Delete">×</button>
    </div>
  </article>`;
}

function openModal(id=null) {
  const t=id ? tasks.find(x=>x.id===id) : null;
  $("#editId").value=t?.id||"";
  $("#modalTitle").textContent=t?"Edit task":"New task";
  $("#titleInput").value=t?.title||"";
  $("#descriptionInput").value=t?.description||"";
  $("#priorityInput").value=t?.priority||"medium";
  $("#dueDateInput").value=t?.dueDate||"";
  $("#dueTimeInput").value=t?.dueTime||"";
  $("#categoryInput").value=t?.category||categories[0]||"";
  $("#taskModal").classList.remove("hidden");
  setTimeout(()=>$("#titleInput").focus(),50);
}
function closeModal(){ $("#taskModal").classList.add("hidden"); }

$("#taskForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("#editId").value;
  const data={
    title:$("#titleInput").value.trim(),
    description:$("#descriptionInput").value.trim(),
    category:$("#categoryInput").value,
    priority:$("#priorityInput").value,
    dueDate:$("#dueDateInput").value,
    dueTime:$("#dueTimeInput").value
  };
  if(!data.title)return;
  if(id) {
    const t=tasks.find(x=>String(x.id)===String(id));
    Object.assign(t,data);
    toast("Task updated");
  } else {
    tasks.unshift({...data,id:Date.now(),completed:false,createdAt:Date.now()});
    toast("Task created");
  }
  save(); closeModal(); render();
});

$$("[data-close-modal]").forEach(x=>x.onclick=closeModal);
$("#newTaskBtn").onclick=()=>openModal();
$("#emptyAddBtn").onclick=()=>openModal();

$("#taskList").addEventListener("click",e=>{
  const task=e.target.closest(".task"); if(!task)return;
  const id=Number(task.dataset.id), action=e.target.closest("[data-action]")?.dataset.action;
  if(action==="toggle"){const t=tasks.find(x=>x.id===id);t.completed=!t.completed;save();render();toast(t.completed?"Task completed ✓":"Task reopened");}
  if(action==="edit")openModal(id);
  if(action==="delete"){tasks=tasks.filter(x=>x.id!==id);save();render();toast("Task deleted");}
});

$("#taskList").addEventListener("dragstart",e=>{
  const task=e.target.closest(".task"); draggedId=Number(task?.dataset.id);
});
$("#taskList").addEventListener("dragover",e=>e.preventDefault());
$("#taskList").addEventListener("drop",e=>{
  e.preventDefault();
  const target=e.target.closest(".task"); if(!target||draggedId===null)return;
  const targetId=Number(target.dataset.id);
  const from=tasks.findIndex(x=>x.id===draggedId), to=tasks.findIndex(x=>x.id===targetId);
  if(from<0||to<0||from===to)return;
  const [moved]=tasks.splice(from,1);tasks.splice(to,0,moved);save();render();toast("Order updated");draggedId=null;
});

$$(".nav-item").forEach(btn=>btn.onclick=()=>{
  currentView=btn.dataset.view;currentCategory=null;
  $$(".nav-item").forEach(x=>x.classList.remove("active"));btn.classList.add("active");render();
});
$("#searchInput").addEventListener("input",render);
$("#sortBtn").onclick=()=>{sortNewest=!sortNewest;render();toast(sortNewest?"Newest first":"Oldest first");};
$("#clearCompleted").onclick=()=>{
  const n=tasks.filter(t=>t.completed).length;
  if(!n)return toast("No completed tasks");
  tasks=tasks.filter(t=>!t.completed);save();render();toast(`${n} completed task${n>1?"s":""} cleared`);
};
$("#themeBtn").onclick=()=>{
  document.body.classList.toggle("light");
  localStorage.setItem(THEME_STORAGE,document.body.classList.contains("light")?"light":"dark");
};
$("#focusBtn").onclick=()=>document.body.classList.toggle("focus");
$("#mobileMenu").onclick=()=>$(".sidebar").classList.toggle("open");

$("#addCategory").onclick=()=>{
  const name=prompt("Category name:");
  const clean=name?.trim();
  if(!clean)return;
  if(categories.some(c=>c.toLowerCase()===clean.toLowerCase()))return toast("Category already exists");
  categories.push(clean);save();render();toast("Category added");
};

document.addEventListener("keydown",e=>{
  if(e.key==="/" && document.activeElement.tagName!=="INPUT" && document.activeElement.tagName!=="TEXTAREA"){e.preventDefault();$("#searchInput").focus();}
  if(e.key==="n" && !e.metaKey && !e.ctrlKey && document.activeElement.tagName!=="INPUT" && document.activeElement.tagName!=="TEXTAREA")openModal();
  if(e.key==="Escape")closeModal();
});

function toast(message){
  const t=$("#toast");t.textContent=message;t.classList.add("show");
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
}

if(localStorage.getItem(THEME_STORAGE)==="light")document.body.classList.add("light");
updateHeader();render();
