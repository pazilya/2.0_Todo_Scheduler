import Widgit from './widgit.js';

var widgits = [];
var selectedWidgit;

function generate_table() {
  var old_table = document.getElementsByTagName("table");
  old_table.innerHTML = "";
  var tbl = document.createElement("table");

  const tblBody = document.createElement("tbody");

  for (let h = 10; h < 27; h++) {
    const hourCell = document.createElement("td");
    if (h > 23) {
      hourCell.innerText = h - 24 + ":00";
    } else {
      hourCell.innerText = h + ":00";
    }
    hourCell.setAttribute("rowspan", "4");
    hourCell.classList.add('hourCell');

    for (let i = 0; i < 4; i++) {
      const row = document.createElement("tr");
      const secondCell = document.createElement("td");
      secondCell.classList.add('secondCell');
      secondCell.setAttribute("id", "cell-" + h + "-" + i);
      row.classList.add('row');
      row.setAttribute("id", "row-" + h + "-" + i);

      if (i === 0) {
        row.appendChild(hourCell);
        secondCell.classList.add('secondCellOne');
      } else if (i === 1) {
        secondCell.classList.add('secondCellTwo');
      } else if (i === 2) {
        secondCell.classList.add('secondCellThree');
      }

      row.appendChild(secondCell);
      tblBody.appendChild(row);
    }
  }

  tbl.appendChild(tblBody);
  tbl.className = 'myTable';
  document.body.appendChild(tbl);

}

function generate_add_elements() {
  const startHourSelect = document.createElement("select");
  const startQuartSelect = document.createElement("select");
  const timeLengthSelect = document.createElement("select");

  const clockColonLabel = document.createElement("label");
  clockColonLabel.innerText = ":";
  const startTimeLabel = document.createElement("label");
  const timeLengthLabel = document.createElement("label");

  startTimeLabel.innerText = "Start Time:";
  startHourSelect.setAttribute("id", "start-hour-select");
  startQuartSelect.setAttribute("id", "start-quart-select");
  timeLengthLabel.innerText = "  Length:";
  timeLengthSelect.setAttribute("id", "time-length-select");

  // set options of start time dropdowns
  for (var h = 8; h < 24; h++) {
    const hourOption = document.createElement("option");
    hourOption.setAttribute("value", h);
    if (h === 8) { hourOption.setAttribute("selected", "selected"); }
    hourOption.innerText = h;
    startHourSelect.appendChild(hourOption);
  }

  for (var i = 0; i < 4; i++) {
    const quartOption = document.createElement("option");
    quartOption.setAttribute("value", i);
    if (i === 0) {
      quartOption.setAttribute("selected", "selected");
      quartOption.innerText = "00";
    } else {
      quartOption.innerText = i * 15;
    }
    startQuartSelect.appendChild(quartOption);
  }
  // set options of time length dropdown
  for (var l = 15; l < 600; l += 15) {
    const lengthOption = document.createElement("option");
    lengthOption.setAttribute("value", l);
    var tempText = Math.floor(l / 60).toString() + ":" + l % 60
    if (l % 60 === 0) {
      tempText += "0";
    }

    lengthOption.innerText = tempText;

    if (l === 30) {
      lengthOption.setAttribute("selected", "selected");
    }
    timeLengthSelect.appendChild(lengthOption);
  }

  const addSubmit = document.createElement("button");
  addSubmit.innerText = "Add Widget";
  addSubmit.setAttribute("id", "add-button");
  addSubmit.addEventListener("click", addWidgetButtonHandler);
  const lineBreak = document.createElement("br");

  document.body.appendChild(addSubmit);
  document.body.appendChild(startTimeLabel);
  document.body.appendChild(startHourSelect);
  document.body.appendChild(clockColonLabel);
  document.body.appendChild(startQuartSelect);
  document.body.appendChild(timeLengthLabel);
  document.body.appendChild(timeLengthSelect);
  document.body.appendChild(lineBreak);
  document.body.appendChild(lineBreak);
  document.body.appendChild(lineBreak);
}

function addWidgetButtonHandler(e) {
  var startHour = document.getElementById("start-hour-select");
  startHour = startHour.value;
  var startMinute = document.getElementById("start-quart-select");
  startMinute = startMinute.value;
  var length = document.getElementById("time-length-select");
  length = length.value;

  var widgit = new Widgit(startHour, startMinute, length);
  widgits.push(widgit);

  console.log(JSON.stringify(widgits));
  displayWidgits();
}

function addTodo(e) {
  selectedWidgit.todos.push(e.target.value);
}

function setSelectedWidgit(event) {
  var id = event.target.id.split("-");
  var widgit_id = ["widgit", id.at(-2), id.at(-1)];
  widgit_id = widgit_id.join("-");

  for (var i = 0; i < widgits.length; i++) {
    if (widgits[i].id === widgit_id) {
      selectedWidgit = widgits[i];
    }
  }
}

function displayWidgits() {
  for (var i = 0; i < widgits.length; i++) {
    var h = widgits[i].startHour;
    var q = widgits[i].startQuart;
    var cell_id_array = ["cell", h, q];

    const startCell = document.getElementById(cell_id_array.join('-'));
    startCell.innerHTML = '';
    var span = widgits[i].timeLength / 15;

    startCell.setAttribute("rowspan", span);
    startCell.setAttribute("style", "height: " + widgits[i].timeLength + "px;");
    startCell.classList.add('widget');

    var ul = document.createElement("ul");

    if (widgits[i].todos.length === 0) {
      var li = document.createElement("li");
      var todoInput = document.createElement("input");
      todoInput.setAttribute("id", "input-" + h + "-" + q);
      todoInput.focus();
      todoInput.addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          setSelectedWidgit(event);
          addTodo(event);
          generate_table();
          displayWidgits();
        }
      });
      todoInput.addEventListener("blur", function(event){
        setSelectedWidgit(event);
        addTodo(event);
        generate_table();
        displayWidgits();
      })

      li.appendChild(todoInput);
      ul.appendChild(li);
    } else {
      for (var todo_i = 0; todo_i < widgits[i].todos.length; todo_i++) {
        var li = document.createElement("li");
        var todoSpan = document.createElement("span");
        todoSpan.setAttribute("id", "widgit-" + i + "-todo-" + todo_i);
        todoSpan.innerText = widgits[i].todos[todo_i];
        li.appendChild(todoSpan);
        ul.appendChild(li);
      }
    }

    ul.setAttribute("tabindex", 0);

    startCell.appendChild(ul);

    // clear table cells behind widgit 
    for (var j = 1; j < span; j++) {
      var row_id = ["row", h, q]
      if (q < 3) {
        row_id[2] = ++q;
      }
      else {
        q = 0;
        row_id[2] = 0;
        row_id[1] = ++h;
      }
      var temp_row = document.getElementById(row_id.join("-"));
      temp_row.deleteCell(-1);
    }
  }
}

generate_add_elements();
generate_table();