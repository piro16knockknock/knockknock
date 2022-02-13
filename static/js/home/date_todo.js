var edit_btn = document.querySelector('.edit-btn');
var delete_btn = document.querySelector('.delete-btn');
var edit_div = document.querySelector('.edit-todo');
var form = document.querySelector('#setToDoModal form');

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
        add_form_cate_div.style.display = 'block';
    }
};

// 할 일 추가 ajax 
const requestAdd = new XMLHttpRequest();   

function addTodoBtn(event, select_date) {
    const url = `./${select_date}/add`;
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
        
    }
};

// 할 일 삭제 ajax 
const requestDelete = new XMLHttpRequest();   

function deleteTodoBtn(event, select_date) {
    todo_id = event.classList[3];
    console.log(todo_id);
    const url = `./${select_date}/${todo_id}/delete/`;
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
        const delete_todo_div = document.querySelector(`.todo-id-${todo_id}`);
        delete_todo_div.remove() 
        delete_btn.classList.remove(todo_id);
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
};

function showEdit(event) {
    delete_btn.style.display = 'None';
    edit_div.style.display = 'block';
};

function closeEdit(event) {
    delete_btn.style.display = 'inline-block';
    edit_div.style.display = 'None';
    todo_id = delete_btn.classList[3];
    console.log(todo_id);
    delete_btn.classList.remove(todo_id);
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