export default class Widgit {
  startHour;
  startQuart;
  timeLength;
  allComplete = false;
  todos = [];
  id = "widgit-";
  
  constructor(startHour, startQuart, timeLength) {
    this.startHour = startHour;
    this.startQuart = startQuart;
    this.timeLength = timeLength;
    this.id += startHour + "-" + startQuart;
  }

}