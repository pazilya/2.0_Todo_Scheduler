// import Widgit from 'widgit.js';

export default class Todo {
  id;
  todoText;
  completed = false;
  widgit_id = "main-widgit";
  constructor(todoText, widgit_id, index){
    this.todoText = todoText;
    this.widgit_id = widgit_id;
    this.id = widgit_id + "-todo-" + index;
  }
  toggle(){
    this.completed = !this.completed;
  }
  setTodoText(newText){
    this.todoText = newText;
  }
}