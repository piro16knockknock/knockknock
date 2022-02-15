var edit_btn = document.querySelector('.edit-todo-btn');
var delete_btn = document.querySelector('.delete-btn');
var postpone_btn = document.querySelector('.postpone-btn')
var edit_div = document.querySelector('.edit-todo');
var form = document.querySelector('#setToDoModal form');
const addTodoModal = document.querySelector('#addToDoModal');
console.log(addTodoModal);

// 어떤 cate의 할일 추가하기를 선택했냐에 따른 설정 모달 내 보여주는 내용 수정
function setAddBtn(event, cate_id, cate_name, user_id) {
    const add_modal_title = document.querySelector('#addToDoModal .modal-title');
    const add_form_user_div = document.querySelector('#addToDoModal form .select-todo-user');
    const add_form_cate_div = document.querySelector('#addToDoModal form .select-todo-cate');

    if (user_id != undefined && cate_id == '') {
        add_modal_title.innerHTML = "기타 카테고리에 할 일 추가하기";
        add_form_user_div.style.display = 'None';
        add_form_cate_div.style.display = 'None';
        add_form_user_div.querySelector(`.user-id-${user_id}`).checked = true;
        add_form_cate_div.querySelector(`.cate-id-no-cate`).checked = true;
    }
    else if(cate_name != undefined ) {
        add_modal_title.innerHTML = cate_name + " 카테고리에 할 일 추가하기";
        add_form_user_div.style.display = 'None';
        add_form_cate_div.style.display = 'None';
        add_form_user_div.querySelector(`.user-id-${user_id}`).checked = true;
        add_form_cate_div.querySelector(`.cate-id-${cate_id}`).checked = true;
    }
    else {
        add_modal_title.innerHTML = "할 일 추가하기";
        // add_form_cate_div.style.display = 'block';
        add_form_user_div.querySelector(`.user-id-no-user`).checked = true;
    }
};


// 어떤 todo를 선택했냐에 따른 설정 모달 내 할 일 수정, 삭제 url setup
function setEditBtn (event, content, user_name, cate_name, select_date) {
    console.log(event);
    for (var i=0, l=edit_btn.classList.length; i<l; ++i) {
        if(/todo-id-.*/.test(edit_btn.classList[i])) {
            edit_btn.classList.replace(edit_btn.classList[i], event.classList[1]);
            delete_btn.classList.replace(delete_btn.classList[i], event.classList[1]);
            return;
        }
    }
    edit_btn.classList.add(event.classList[1]);
    delete_btn.classList.add(event.classList[1]);
    postpone_btn.setAttribute('href', `/${select_date}/${event.classList[1]}/postpone/`);
    console.log(postpone_btn)
};


// ajax로 현재 todo_id 가져가고, todo내용 가져와서 form 만들어주기
const reqMakeEditForm = new XMLHttpRequest();   
function showEdit(event, select_date) {
    todo_id = edit_btn.classList[3];
    edit_div.style.display = 'block';
    const url = `/home/todo/${select_date}/${todo_id}/make-edit-form/`;
    reqMakeEditForm.open("POST", url, true);
    reqMakeEditForm.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded",
    );
    reqMakeEditForm.send(JSON.stringify({
        todo_id : todo_id,
    }));
};

reqMakeEditForm.onreadystatechange = () => {
    if (reqMakeEditForm.readyState === XMLHttpRequest.DONE) {
        makeEditFormHandleResponse();
    }
};

const  makeEditFormHandleResponse = () => {
    if (requestAdd.status < 400) {
        console.log(JSON.parse(reqMakeEditForm.response));
        const {content, cate_id, user_id, priority_id} = JSON.parse(reqMakeEditForm.response);
        
        const edit_todo_form = document.querySelector('.edit-todo form');
        const content_input = edit_todo_form.querySelector('input[name="content"]')
        const select_cate_div = edit_todo_form.querySelector(`div.select-todo-cate input.cate-id-${cate_id}`);
        const select_user_div = edit_todo_form.querySelector(`div.select-todo-user input.user-id-${user_id}`);
        const select_priority_div = edit_todo_form.querySelector(`div.select-todo-priority input.priority-id-${priority_id}`);
        console.log(priority_id);
        content_input.value = content;
        select_cate_div.setAttribute('checked', true);
        select_user_div.setAttribute('checked', true);
        select_priority_div.setAttribute('checked', true);
        
    }
}


function closeEdit() {
    delete_btn.style.display = 'inline-block';
    edit_div.style.display = 'None';
    todo_id = delete_btn.classList[3];
    console.log(todo_id);
    delete_btn.classList.remove(todo_id);
    edit_btn.classList.remove(todo_id);
};

// 할 일 추가 ajax 
const requestAdd = new XMLHttpRequest();   
function addTodoBtn(event, select_date) {
    const url = `/home/todo/${select_date}/add/`;
    const form = new FormData(document.querySelector('#addToDoModal form'));
    var form_data = serialize(form);
    requestAdd.open("POST", url, true);
    requestAdd.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded",
    );
    requestAdd.send(JSON.stringify({
        form_data : form_data,
    }));
};

requestAdd.onreadystatechange = () => {
    if (requestAdd.readyState === XMLHttpRequest.DONE) {
        AddHandleResponse();
    }
};
//  add_todo_안에 내용 채우기 ($$$$$선영 언니 도움!)
const AddHandleResponse = () => {
    if (requestAdd.status < 400) {
        const {todo_id, todo_content, todo_priority_content, todo_priority_num, cate_id, cate_name, user_name}= JSON.parse(requestAdd.response);
        var todos = null;
        const new_todo = document.createElement('div');
        if (user_name === 'no-user') {
            todos = document.querySelector(`.no-user-cate .add-todo`);
            new_todo.classList = `total-todo todo-cnt todo-id-${todo_id}`;
        }
        else if (cate_name === 'no-cate') {
            todos = document.querySelector(`.user-cate-container .etc-cate .add-todo`);
            new_todo.classList = `etc-todo todo-cnt todo-id${todo_id}`;
        }
        else {
            todos = document.querySelector(`#cate-id-${ cate_id } .add-todo`);
            new_todo.classList = `user-todo todo-cnt todo-id-${todo_id}`;
        }

        const todo_align = document.createElement('div');
        todo_align.classList = "d-flex align-items-center";

        const priority_contentP = document.createElement('p');
        priority_contentP.innerHTML = todo_priority_content
        // 우선순위에 따른 아이콘 부여하는 부분
        const priority_icon = document.createElement('p');
        priority_icon.innerHTML = todo_priority_num;

        const todo_edit_btn = document.createElement('button');
        todo_edit_btn.classList = `edit-btn ${todo_id} btn btn-ligth`;
        todo_edit_btn.type = "button";
        todo_edit_btn.setAttribute('onclick', `setEditBtn(this, '${todo_content}', '${user_name }', '${cate_name}')`); 
        todo_edit_btn.setAttribute('data-bs-toggle',"modal");
        todo_edit_btn.setAttribute('data-bs-target',"#setToDoModal");
        todo_edit_btn.innerHTML = "<i class='fa-solid fa-ellipsis'></i>";

        const todo_contentP = document.createElement('p');
        todo_contentP.innerHTML = todo_content;
        
        todo_align.appendChild(priority_contentP);
        todo_align.appendChild(priority_icon);
        todo_align.appendChild(todo_edit_btn);
        todo_align.appendChild(todo_contentP);

        new_todo.appendChild(todo_align);
        todos.before(new_todo);

        addModalReset();
    }
};

function addModalReset() {
    filled_addToDoModal = document.querySelector('#addToDoModal');
    filled_addToDoModal.innerHTML = addTodoModal.innerHTML;
}

// 할 일 삭제 ajax 
const requestDelete = new XMLHttpRequest();   

function deleteTodoBtn(event, select_date) {
    todo_id = event.classList[3];
    console.log(todo_id);
    const url = `/home/todo/${select_date}/${todo_id}/delete/`;
    requestDelete.open("POST", url, true);
    requestDelete.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded",
    );
    requestDelete.send(JSON.stringify({
        todo_id : todo_id,
    }));
};

requestDelete.onreadystatechange = () => {
    if (requestDelete.readyState === XMLHttpRequest.DONE) {
        deleteHandleResponse();
    }
};

const deleteHandleResponse = () => {
    if (requestDelete.status < 400) {
        const {todo_id} = JSON.parse(requestDelete.response);
        const delete_todo_divs = document.querySelectorAll(`.todo-id-${todo_id}`);
        for (i=0; i <=delete_todo_divs.length; i++) {
            var delete_todo_div = delete_todo_divs[i];
            delete_todo_div.remove(); 
        }
        delete_btn.classList.remove(todo_id);
    }
};

//할 일 수정 ajax
const reqEditTodo = new XMLHttpRequest();

function editTodoBtn(event, select_date) {
    todo_id = edit_btn.classList[3];
    const form = new FormData(document.querySelector('#setToDoModal form'));
    var form_data = serialize(form);

    const url = `/home/todo/${select_date}/${todo_id}/edit/`;
    reqEditTodo.open("POST", url, true);
    reqEditTodo.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded",
    );
    reqEditTodo.send(JSON.stringify({
        todo_id : todo_id,
        form_data : form_data,
    }));
}

reqEditTodo.onreadystatechange = () => {
    if (reqEditTodo.readyState === XMLHttpRequest.DONE) {
        editHandleResponse();
    }
};

const editHandleResponse = () => {
    if (reqEditTodo.status < 400) {

        console.log(JSON.parse(reqEditTodo.response));
        const {todo_id, content, priority_num} = JSON.parse(reqEditTodo.response);
        const edit_todo_div = document.querySelector(`.todo-id-${todo_id}`);
        console.log(todo_id);

        const edit_content = edit_todo_div.querySelector('div p');
        edit_content.innerHTML = priority_num;
        console.log(edit_todo_div);
        closeEdit();
    }
};

requestDelete.onreadystatechange = () => {
    if (requestDelete.readyState === XMLHttpRequest.DONE) {
        deleteHandleResponse();
    }
};


// Utils
function serialize (data) {
    let obj = {};
    for (let [key, value] of data) {
        if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
            }
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}


// 할 일 완료하기 ajax
const reqDoneTodo = new XMLHttpRequest();
async function isDoneBtn(event, select_date, id) {
    const url = `/home/todo/${select_date}/${id}/done/`
    const res = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'todo_id' : id,
        })
    })
    const {
        todo_id : todo_id,
        todo_content : todo_content,
        todo_is_done_date : todo_is_done_date,
        todo_is_postpone :todo_is_postpone,
    } = await res.json()
    doneTodoHandleResponse(todo_id, todo_content, todo_is_done_date, todo_is_postpone);
}

const doneTodoHandleResponse = (todo_id, todo_content, todo_is_done_date, todo_is_postpone) =>{
    console.log('response is coming')
    
    const todo_div = document.querySelector(`.todo-id-${todo_id}`);
    const doing_todo_div = document.querySelector(`.doing-cate .todo-id-${todo_id}`);
    todo_div.remove()
    doing_todo_div.remove()

    const user_complete_cate_div = document.querySelector('.complete-user-todos');
    const total_complete_cate_div = document.querySelector('.total-cate-container');

    const complete_todo_div = document.createElement('div');
    complete_todo_div.setAttribute('class', 'complete-total-todo');

    const complete_todo_head_div = document.createElement('div');
    complete_todo_head_div.setAttribute('class', 'com-todo-head d-flex align-items-baseline justify-content-between');

    const notDoneBtn = document.createElement('button');
    notDoneBtn.setAttribute('class', 'btn');
    notDoneBtn.setAttribute('onclick', 'notDoneBtn()');
    notDoneBtn.innerHTML = '<i class="fa-solid fa-check-circle text-secondary"></i>';

    const contentP = document.createElement('p');
    contentP.innerHTML = todo_content;

    const feedbackBtn = document.createElement('div');
    feedbackBtn.setAttribute('class', 'btn');
    feedbackBtn.innerHTML = '<i class="fas fa-heart"></i>';

    const com_todo_text_div = document.createElement('div');
    com_todo_text_div.setAttribute('class', 'com-todo-text');
    if (todo_is_postpone) {
        com_todo_text_div.innerHTML = `<p>${todo_is_done_date}</p><p>잊지 않고 해냈어요!</p>`;
    } else {
        com_todo_text_div.innerHTML = `<p>${todo_is_done_date}</p><p>미루지 않고 해냈어요!</p>`;
    }
    console.log(com_todo_text_div);
    
    complete_todo_head_div.appendChild(notDoneBtn);
    complete_todo_head_div.appendChild(contentP);
    complete_todo_head_div.appendChild(feedbackBtn);

    complete_todo_div = complete_todo_div.appendChild(complete_todo_head_div);
    complete_todo_div.appendChild(com_todo_text_div);

    const users = complete_todo_div;
    const totals = complete_todo_div;

    user_complete_cate_div.appendChild(users);
    total_complete_cate_div.appendChild(totals);
}
