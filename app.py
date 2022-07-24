from enum import unique
import os

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Widget(db.Model):
    __tablename__ = "widget"
    id = db.Column(db.Integer, primary_key=True)
    todos = db.relationship("Todo", backref='widget', lazy=True)

class Todo(db.Model):
    __tablename__ = "todo"
    id = db.Column(db.Integer, primary_key=True)
    todoText = db.Column(db.String(144), nullable=False)
    completed = db.Column(db.Boolean, unique=False, nullable=False)
    widget_id = db.Column(db.Integer, db.ForeignKey('widget.id'))

    def __init__(self, todo, completed, widget_id):
        self.todoText = todo
        self.completed = completed
        self.widget_id = widget_id

    def __repr__(self):
        return f"[{'x' if self.completed else ' '}]- {self.todoText}"


@app.route('/')
def index():
    return render_template('todoScheduler.html')

if __name__ == '__main__':
    app.run(debug=True)