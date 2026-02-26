#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "todos.json");
const program = new Command();

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

function saveTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

function loadTodos() {
  try {
    const data = JSON.parse(fs.readFileSync(filePath));
    return data;
  } catch (err) {
    return [];
  }
}

program.name("todo").description("a simple cli todo app").version("1.0.0");

program
  .command("add <text...>")
  .description("add a new todo")
  .action((text) => {
    const todos = loadTodos();

    const newTodo = {
      text: text.join(" "),
      completed: false,
    };

    todos.push(newTodo);
    saveTodos(todos);

    console.log("Todo added successfully!");
  });

program
  .command("done <number>")
  .description("Mark a todo as completed")
  .action((number) => {
    const todos = loadTodos();
    const index = Number(number) - 1;

    if (index < 0 || index >= todos.length) {
      console.log("Invalid todo number.");
      return;
    }

    todos[index].completed = true;
    saveTodos(todos);

    console.log("Todo marked as done!");
  });

program
  .command("list")
  .description("List all todos")
  .action(() => {
    const todos = loadTodos();

    if (todos.length === 0) {
      console.log("No todos yet!");
      return;
    }

    console.log("\n Your Todos:");

    todos.forEach((todo, index) => {
      console.log(
        `${index + 1}.  ${todo.text} ${todo.completed ? "(Done)" : ""}`,
      );
    });

    console.log("");
  });

program
  .command("delete <number>")
  .description("delete a todo")
  .action((number) => {
    const todos = loadTodos();
    const index = Number(number) - 1;

    if (index < 0 || index >= todos.length) {
      console.log("Invalid todo number.");
      return;
    }

    todos.splice(index, 1);
    saveTodos(todos);

    console.log("todo deleted")
  });

program.parse(process.argv);
