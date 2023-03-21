export const handleToggleTodo = (todos: any, setTodos: (newState: any) => void, indexToDoCompleted: number) => {
const newTodos = [...todos];
newTodos[indexToDoCompleted].completed = !newTodos[indexToDoCompleted].completed;
setTodos(newTodos);
};

export const handleDeleteTodo = (todos: any, setTodos: (newState: any) => void, indexTodoToDelete: number) => {
const newTodos = [...todos];
newTodos.splice(indexTodoToDelete, 1);
setTodos(newTodos);
};

export const handleValidateTask = (todos: any, setTodos: (newState: any) => void, index: number) => {
const updatedTasks = [...todos];
updatedTasks[index] = { ...updatedTasks[index], completed: true };
setTodos(updatedTasks);
}


// export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// setNewTodo(e.target.value);
// };