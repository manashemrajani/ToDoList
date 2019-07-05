let ToDoListManager = (function () {
    function _render(list) {
        var ul = document.getElementById("task-list");
        ul.innerHTML = "";
        //let sortedList = list.sort();
        list.forEach(item => _appendNode(item));
    }

    function createTask(item) {
        if (item.value) {
            _appendNode(item.value);
            let newList = _addIntoStorage(item.value);
            _render(newList);
            item.value = "";
        }
    }
    function _dragStart(ev) {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData("task", ev.target.id);
        ev.dataTransfer.setDragImage(ev.target, 0, 0);
        return true;
     }

     function dragEnter(ev) {
        event.preventDefault();
        return true;
     }
     
     function dragOver(ev) {
        return false;
     }

     function dragDrop(ev) {
        var src = ev.dataTransfer.getData("task");
        // let newLi = document.createElement("li");
        // newLi.addEventListener("dragstart",dragStart);
        // newLi.setAttribute("draggable",true);
        // newLi.innerText = src;
        // ev.target.closest("ul").appendChild(newLi);
        ev.target.insertAdjacentElement("afterEnd",document.getElementById(src));
        ev.stopPropagation();
        return false;
     }
    function _appendNode(value) {
        var ul = document.getElementById("task-list");
        let li = document.createElement("li");
        li.classList.add("item");
        li.dataset.text = value;
        li.setAttribute("draggable", true);
        li.setAttribute("id", value);
        li.addEventListener("dragstart", (event) => {return _dragStart(event)});
        let removeBtn = document.createElement("button");
        removeBtn.innerHTML = "Remove";
        removeBtn.addEventListener("click", element => removeTask(element))
        li.appendChild(document.createTextNode(value));
        li.appendChild(removeBtn);
        ul.appendChild(li);
    }

    function _addIntoStorage(value) {
        let list = _getFromStorage();
        list.add(value);
        _setIntoStore(list);
        return list;
    }

    function _getFromStorage() {
        return new Set(JSON.parse(localStorage.getItem("list"))) || new Set([]);
    }

    function _setIntoStore(list) {
        localStorage.setItem("list", JSON.stringify(Array.from(list)));
    }

    function _removeTaskFromStorage(task) {
        let taskList = _getFromStorage();
        let text = task.srcElement.closest("li").dataset.text;
        taskList.delete(text);
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
        let list = [..._getFromStorage()];
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
        dragEnter,
        dragDrop,
        dragOver,
        filterTasks: _debounce(filterTasks, 500)
    }
})();
