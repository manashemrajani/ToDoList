let ToDoListManager = (function () {
    function _render(list) {
        var ul = document.getElementById("task-list");
        ul.innerHTML = "";
        let sortedList = list.sort();
        sortedList.forEach(item => _appendNode(item));
    }

    function createTask(item) {
        if (item.value) {
            _appendNode(item.value);
            let newList = _addIntoStorage(item.value);
            _render(newList);
            item.value = "";
        }
    }

    function _appendNode(value) {
        var ul = document.getElementById("task-list");
        let li = document.createElement("li");
        li.classList.add("item");
        li.dataset.text = value;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", (ele => console.log(ele)));
        let removeBtn = document.createElement("button");
        removeBtn.innerHTML = "Remove";
        removeBtn.addEventListener("click", element => removeTask(element))
        li.appendChild(document.createTextNode(value));
        li.appendChild(removeBtn);
        ul.appendChild(li);
    }

    function _addIntoStorage(value) {
        let list = JSON.parse(localStorage.getItem("list")) || [];
        list.push(value);
        _setIntoStore(list);
        return list;
    }

    function _getFromStorage() {
        return JSON.parse(localStorage.getItem("list")) || [];
    }

    function _setIntoStore(list) {
        localStorage.setItem("list", JSON.stringify(list));
    }

    function _removeTaskFromStorage(task) {
        let taskList = _getFromStorage();
        let text = task.srcElement.closest("li").dataset.text;
        let index = taskList.findIndex((ele) => ele === text);
        taskList.splice(index, 1);
        _setIntoStore(taskList);
    }

    function _removeNode(task) {
        var ul = document.getElementById("task-list");
        ul.removeChild(task.srcElement.closest("li"));
    }

    function removeTask(task) {
        _removeTaskFromStorage(task);
        _removeNode(task);
    }
    function filterTasks(val) {
        let list = _getFromStorage();
        let filteredList = list.filter(item => item.includes(val));
        _render(filteredList.length && filteredList || list);
    }

    _render(_getFromStorage());
    
    function _debounce(fn, interval) {
        let timer;
        return function () {
            clearTimeout(timer);
            let args = arguments, context = this;
            timer = setTimeout(() => fn.apply(context, args), interval);
        }
    }
    return {
        createTask,
        removeTask,
        filterTasks: _debounce(filterTasks, 500)
    }
})();
