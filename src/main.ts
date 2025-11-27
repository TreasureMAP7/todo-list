const addTask = document.getElementById("add")! as HTMLButtonElement;
const deleteAllTask = document.getElementById("delete")! as HTMLButtonElement;
const task = document.getElementById("task")! as HTMLInputElement;

const table = document.getElementById("table")! as HTMLTableElement;

const percentage = document.getElementById("percentage")! as HTMLSpanElement;
const fraction = document.getElementById("fraction")! as HTMLSpanElement;
const cbar = document.getElementById("cbar")! as HTMLDivElement;

let tasks: number = 0;
let completed: number = 0;
let confirmDel: boolean = false;

window.addEventListener("load", () => {
  loadData();
});

addTask.addEventListener("click", () => {
  if (task.value != "") {
    createRow();
  }
});

deleteAllTask.addEventListener("click", () => {
  if (tasks > 0) {
    removeAll();
  }
});

function createRow(isLoading = false) {
  const newRow = document.createElement("tr");

  const meta: string[] = ["index", "task", "status", "delete"];

  for (let i = 0; i < 4; i++) {
    const newData = document.createElement("td");
    newData.classList.add(meta[i]);
    switch (i) {
      case 0:
        newData.textContent = tasks.toString();
        break;

      case 1:
        let content = task.value;
        newData.textContent = content;
        task.value = "";
        newData.classList.add("left");
        break;

      case 2:
        const check = document.createElement("input");
        check.type = "checkbox";
        newData.appendChild(check);
        check.addEventListener("change", () => checkbox(newData));
        break;

      case 3:
        const remove = document.createElement("button");
        remove.innerHTML = "Clear";
        newData.appendChild(remove);
        remove.addEventListener("click", () => removeTask(newData));
        break;
    }
    newRow.appendChild(newData);
  }
  table.appendChild(newRow);
  console.log("New Task Created");
  tasks++;
  if (!isLoading) {
    updateIndex();
    updateProgress();
    saveData();
  }
}

function checkbox(object: HTMLTableCellElement) {
  const row = object.parentElement!;
  const task = row.querySelectorAll("td")[1];
  const checkbox = object.querySelector("input")!;
  if (checkbox.checked) {
    task.style.textDecoration = "line-through";
    completed++;
  } else {
    task.style.textDecoration = "none";
    completed--;
  }
  updateProgress();
  saveData();
}

function removeTask(object: HTMLTableCellElement) {
  const row = object.parentElement!;
  const check = row.querySelector("input") as HTMLInputElement;
  row.remove();
  tasks--;
  if (check.checked) {
    completed--;
  }
  updateIndex();
  updateProgress();
  saveData();
}

function removeAll() {
  if (!confirmDel) {
    confirmDel = true;
    deleteAllTask.innerHTML = "Confirm?";
    setTimeout(() => {
      confirmDel = false;
      deleteAllTask.innerHTML = "Clear All";
    }, 2000);
    return;
  }

  const rows = table.querySelectorAll("tr");
  rows.forEach((row, i) => {
    if (i > 0) {
      row.remove();
    }
  });
  tasks = 0;
  completed = 0;
  updateIndex();
  updateProgress();
  saveData();
  confirmDel = false;
  deleteAllTask.innerHTML = "Clear All";
}

function updateProgress() {
  let totalTask: number = tasks;
  let completedTask: number = completed;
  let percent: number;
  let fract: string;

  if (totalTask != 0) {
    percent = Math.round((completedTask / totalTask) * 100);
    fract = `${completedTask}/${totalTask}`;
  } else {
    percent = 0;
    fract = `None`;
  }

  if (percent == 100) {
    cbar.style.background = "#64df42ff";
  } else {
    cbar.style.background = "#5768d6";
  }
  // console.log(totalTask);
  // console.log(completedTask);

  percentage.innerHTML = percent.toString();
  fraction.innerHTML = `(${fract})`;
  cbar.style.width = percent.toString() + "%";
}

function updateIndex() {
  const rows = table.querySelectorAll("tr");
  let index = 1;

  rows.forEach((row) => {
    const indexing = row.querySelectorAll("td")[0];
    if (indexing) {
      indexing.textContent = index.toString();
      index++;
    }
  });
}

function saveData() {
  const data: any[] = [];
  const rows = table.querySelectorAll("tr");

  rows.forEach((row, i) => {
    if (i == 0) {
      return;
    }

    const td = row.querySelectorAll("td");
    const text = td[1].textContent!;
    const checkbox = td[2].querySelector("input") as HTMLInputElement;

    data.push({
      task: text,
      status: checkbox.checked,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(data));
}

function loadData() {
  const savedData = localStorage.getItem("tasks");
  if (!savedData) {
    return;
  }

  const data = JSON.parse(savedData);

  data.forEach((item: any) => {
    task.value = item.task;
    createRow(true);

    const lastRow = table.querySelectorAll("tr")[table.rows.length - 1];
    const check = lastRow.querySelector("input") as HTMLInputElement;

    check.checked = item.status;

    if (item.status) {
      const task = lastRow.querySelectorAll("td")[1];
      task.style.textDecoration = "line-through";
      completed++;
    }
  });
  updateIndex();
  updateProgress();
}
