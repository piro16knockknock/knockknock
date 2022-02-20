var edit_btn = document.querySelector('.edit-todo-btn');
var delete_btn = document.querySelector('.delete-btn');
var postpone_btn = document.querySelector('.postpone-btn')
var edit_div = document.querySelector('.edit-todo');
var form = document.querySelector('#setToDoModal form');
const addTodoModal = document.querySelector('#addToDoModal');
const select_user_div = edit_div.querySelector('.select-todo-user');
console.log(addTodoModal);

// 어떤 cate의 할일 추가하기를 선택했냐에 따른 설정 모달 내 보여주는 내용 수정
function setAddBtn(event, cate_id, cate_name, user_id) {
    const add_modal_title = document.querySelector('#addToDoModal .modal-title');
    const add_form_user_div = document.querySelector('#addToDoModal form .select-todo-user');
    const add_form_cate_div = document.querySelector('#addToDoModal form .select-todo-cate');

    if (user_id != 'no-user' && cate_name == 'no-cate') {
        add_modal_title.innerHTML = "기타 카테고리에 할 일 추가하기";
        add_form_user_div.style.display = 'None';
        add_form_cate_div.style.display = 'None';
        add_form_user_div.querySelector(`.user-id-${user_id}`).checked = true;
        add_form_cate_div.querySelector(`.cate-id-no-cate`).checked = true;
    }
    else if(user_id != 'no-user' && cate_name !='no-cate' ) {
        add_modal_title.innerHTML = cate_name + " 카테고리에 할 일 추가하기";
        add_form_user_div.style.display = 'None';
        add_form_cate_div.style.display = 'None';
        add_form_user_div.querySelector(`.user-id-${user_id}`).checked = true;
        add_form_cate_div.querySelector(`.cate-id-${cate_id}`).checked = true;
    }
    else {
        add_modal_title.innerHTML = "할 일 추가하기";
        add_form_user_div.style.display = 'None';
        add_form_cate_div.style.display = 'block';
        add_form_user_div.querySelector(`.user-id-no-user`).checked = true;
    }
};


// 어떤 todo를 선택했냐에 따른 설정 모달 내 할 일 수정, 삭제 url setup
function setEditBtn (event, content, user_name, cate_name, select_date) {
    console.log(select_date);
    for (var i=0, l=edit_btn.classList.length; i<l; ++i) {
        if(/todo-id-.*/.test(edit_btn.classList[i])) {
            edit_btn.classList.replace(edit_btn.classList[i], event.classList[1]);
            delete_btn.classList.replace(delete_btn.classList[i], event.classList[1]);
            return;
        }
    }
    edit_btn.classList.add(event.classList[1]);
    delete_btn.classList.add(event.classList[1]);
    // if (user_name === 'no-user') {
    //     edit_div.querySelector('.select-todo-user').style.display = "None"
    // }
    postpone_btn.setAttribute('href', `/home/todo/${select_date}/${event.classList[1]}/postpone/`);
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
        const content_input = edit_todo_form.querySelector('input[name="content"]');
        const select_cate_input = edit_todo_form.querySelector(`div.select-todo-cate input.cate-id-${cate_id}`);
        const select_user_input = edit_todo_form.querySelector(`div.select-todo-user input.user-id-${user_id}`);
        const select_priority_input = edit_todo_form.querySelector(`div.select-todo-priority input.priority-id-${priority_id}`);
        console.log(user_id);

        if (user_id == 'no-user') {
           const select_user_div = edit_todo_form.querySelector('div.select-todo-user');
           select_user_div.style.display = 'None';
        }
        else {
            select_no_user_input = edit_todo_form.querySelector('div.select-todo-user input.user-id-no-user');
            select_no_user_img = edit_todo_form.querySelector('div.select-todo-user img.user-id-no-user');
            select_no_user_img.style.display = 'None';
            select_no_user_input.style.display = 'None';
        }

        const select_cate_inputs = edit_todo_form.querySelectorAll(`div.select-todo-cate input`);
        const select_user_inputs = edit_todo_form.querySelectorAll(`div.select-todo-user input`);
        const select_priority_inputs = edit_todo_form.querySelectorAll(`div.select-todo-priority input`);
    
        resetInput(select_cate_inputs);
        resetInput(select_user_inputs);
        resetInput(select_priority_inputs);
        content_input.value = content;
        select_cate_input.setAttribute('checked', true);
        select_user_input.setAttribute('checked', true);
        select_priority_input.setAttribute('checked', true);
    }
}


function resetInput(inputs) {
    console.log(inputs);
    for (var i=0 ; i < inputs.length; i ++) {
        var input = inputs.item(i);
        input.removeAttribute('checked');
    }
}


function closeEdit() {
    const edit_todo_form = document.querySelector('.edit-todo form');
    const select_cate_inputs = edit_todo_form.querySelectorAll(`div.select-todo-cate input`);
    const select_user_inputs = edit_todo_form.querySelectorAll(`div.select-todo-user input`);
    const select_priority_inputs = edit_todo_form.querySelectorAll(`div.select-todo-priority input`);

    resetInput(select_cate_inputs);
    resetInput(select_user_inputs);
    resetInput(select_priority_inputs);

    console.log(select_user_div);
    var filled_select_user_div = edit_todo_form.querySelector('.select-todo-user');
    filled_select_user_div = select_user_div;

    delete_btn.style.display = 'inline-block';
    edit_div.style.display = 'None';
    todo_id = delete_btn.classList[3];
    console.log(todo_id);
    delete_btn.classList.remove(todo_id);
    edit_btn.classList.remove(todo_id);
};



// 할 일 추가 ajax 
var not_valid_string = '';
function validate_add_form(form) {
    console.log(form);
    if(form['content'] == '') {
        not_valid_string += '할 일 내용 ';
    }
    if (form['cate'] == null) {
        not_valid_string += '카테고리 ';
    }
    if (form['priority'] == null) {
        not_valid_string += '우선순위 ';
    }
    return not_valid_string
}

const requestAdd = new XMLHttpRequest();   
function addTodoBtn(event, select_date) {

    if (addTodoModal.querySelector('.modal-body p.alert') != null) {
        addTodoModal.querySelector('.modal-body p.alert').remove();
    }

    const url = `/home/todo/${select_date}/add/`;
    const form = new FormData(document.querySelector('#addToDoModal form'));
    var form_data = serialize(form);
    not_valid_string = validate_add_form(form_data);
    if (not_valid_string == '') {
        requestAdd.open("POST", url, true);
        requestAdd.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded",
        );
        console.log(requestAdd);
        requestAdd.send(JSON.stringify({
            form_data : form_data,
        }));
        not_valid_string = '';
    }
    else {
        const alert_p = document.createElement('p');
        alert_p.innerHTML  = '채워지지 않은 항목이 존재합니다! : ' + `${not_valid_string}`;
        alert_p.setAttribute('class', 'alert');
        not_valid_string = '';
        addTodoModal.querySelector('.modal-body .select-todo-priority').after(alert_p);
    }
};

requestAdd.onreadystatechange = () => {
    if (requestAdd.readyState === XMLHttpRequest.DONE) {
        AddHandleResponse();
    }
};
//  add_todo_안에 내용 채우기
const AddHandleResponse = () => {
    if (requestAdd.status < 400) {
        var modal = bootstrap.Modal.getInstance(addTodoModal);
        modal.hide();
        const {todo_id, todo_content, todo_priority_content, todo_priority_num, cate_id, cate_name, user_name, select_date, user_profile_url}= JSON.parse(requestAdd.response);
        var todos = null;
        const new_todo = document.createElement('div');
        // 담당없음
        if (user_name === 'no-user') {
            todos = document.querySelector(`.no-user-cate .add-todo`);
            new_todo.classList = `total-todo todo-box todo-id-${todo_id}`;
        }
        // 기타
        else if (cate_name === 'no-cate') {
            todos = document.querySelector(`.user-cate-container .etc-cate .add-todo`);
            new_todo.classList = `etc-todo todo-box todo-id-${todo_id}`;
        }
        // 그 외
        else {
            todos = document.querySelector(`#cate-id-${ cate_id } .add-todo`);
            new_todo.classList = `user-todo todo-box todo-id-${todo_id}`;
        }


        // 상단 priority 부분
        const todo_align = document.createElement('div');
        todo_align.classList = "user-todo-head";
        // 할 일 중간 텍스트와 체크버튼
        const todo_middle = document.createElement('div');
        todo_middle.classList = "todo-cnt";
        // 할 일 아래 edit 버튼
        const todo_bottom = document.createElement('div');
        todo_bottom.classList = "todo-bottom";
        // 우선순위 타입 텍스트
        const priority_contentP = document.createElement('p');
        priority_contentP.innerHTML = todo_priority_content;
        // 우선순위에 따른 아이콘 부여하는 부분
        const priority_icon = document.createElement('i');
        priority_icon.classList = `fa-solid fa-fire priority-${ todo_priority_num }`;
        // 할일 완료 버튼
        const todo_check_btn = document.createElement('button');
        todo_check_btn.classList = "todo-check-btn";
        todo_check_btn.setAttribute('onclick', `isDoneBtn(this, 'select_date', '${todo_id}')`); 
        todo_check_btn.innerHTML = "<i class='fa-regular fa-circle'></i>";

        // 담당없음의 경우 카테고리 이름 & 담당 추가 버튼
        const no_user_cate = document.createElement('p');
        no_user_cate.innerHTML = `${cate_name}`;  // ***아직 담당없음에서 cate_name이 안 보이는 건가? 다른 거 선택해도 기타(no_cate)만 뜸!
        const todo_plus_btn = document.createElement('button');
        todo_plus_btn.classList = "todo-plus-btn";  // ***아직 onclick 이벤트 없어서 이렇게 둠!
        todo_plus_btn.innerHTML = "<i class='fa-solid fa-user-plus'></i>";
        todo_plus_btn.setAttribute('onclick', `setAddUserBtn(this, '${todo_id}', '${select_date}')`);
        todo_plus_btn.setAttribute('data-bs-toggle', 'modal');
        todo_plus_btn.setAttribute('data-bs-target', '#addUserModal');

        // 할일 edit 버튼
        const todo_edit_btn = document.createElement('button');
        todo_edit_btn.classList = `edit-btn ${todo_id} btn date-edit-btn`;
        todo_edit_btn.type = "button";
        todo_edit_btn.setAttribute('onclick', `setEditBtn(this, '${todo_content}', '${user_name }', '${cate_name}', '${select_date}')`); 
        todo_edit_btn.setAttribute('data-bs-toggle',"modal");
        todo_edit_btn.setAttribute('data-bs-target',"#setToDoModal");
        todo_edit_btn.innerHTML = "<i class='fa-solid fa-ellipsis'></i>";

        // 할일 내용 텍스트
        const todo_contentP = document.createElement('p');
        if (user_name === 'no-user') {
            todo_contentP.classList = "all-todo-text";
            todo_middle.appendChild(todo_plus_btn);
            todo_bottom.appendChild(no_user_cate);
        }
        else {
            todo_contentP.classList = "todo-text";
            todo_middle.appendChild(todo_check_btn);
        }
        todo_contentP.innerHTML = todo_content;
        
        todo_align.appendChild(priority_contentP);
        todo_align.appendChild(priority_icon);

        todo_middle.appendChild(todo_contentP);
        todo_bottom.appendChild(todo_edit_btn);

        new_todo.appendChild(todo_align);
        new_todo.appendChild(todo_middle);
        new_todo.appendChild(todo_bottom);

        if (user_name != 'no-user') {
            const doing_todo = new_todo.cloneNode(true);
            doing_todo.querySelector('.todo-bottom').remove();
            console.log(doing_todo);
            doing_todo.querySelector('.todo-cnt .todo-check-btn').remove();

            const profile_box = document.createElement('div');
            profile_box.classList = 'todo-profile-box';
            
            const profile_img = document.createElement('img');
            profile_img.classList = 'cal-profile-img';
            profile_img.setAttribute('src', `${user_profile_url}`);
            profile_box.appendChild(profile_img);

            doing_todo.querySelector('.todo-cnt').classList = 'all-todo-cnt todo-cnt';
            doing_todo.querySelector('.todo-cnt p').classList ='all-todo-text';
            doing_todo.querySelector('.todo-cnt').prepend(profile_box);
            console.log(doing_todo);

            const doing_cate_div = document.querySelector('.doing-cate');
            doing_cate_div.appendChild(doing_todo);
        }
        else {
            const today_no_user_text = document.querySelector('li.today-no-user-text span');
            console.log(today_no_user_text);
            if (today_no_user_text != null) {
                today_no_user_text.innerHTML = `${parseInt(today_no_user_text.innerHTML) + 1}`;
            }
        }
        todos.before(new_todo);

        addModalReset();
    }
};

function addModalReset() {
    const filled_addToDoModal = document.querySelector('#addToDoModal');
    console.log(filled_addToDoModal);
    filled_addToDoModal.innerHTML = addTodoModal.innerHTML;
    if (addTodoModal.querySelector('.modal-body p.alert') != null) {
        addTodoModal.querySelector('.modal-body p.alert').remove();
    }
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
        console.log('response is coming');
        const {todo_id} = JSON.parse(requestDelete.response);
        const cate_todo_div = document.querySelector(`.user-cate-container .todo-id-${todo_id}`);
        const doing_todo_div = document.querySelector(`.doing-cate .todo-id-${todo_id}`);
        const no_user_todo_div = document.querySelector(`.no-user-cate .todo-id-${todo_id}`);
        // 유저 할 일 삭제
        if (cate_todo_div != null) {
            cate_todo_div.remove();
            doing_todo_div.remove();
        }
        // 담당 없는 일 삭제
        else {
            const today_no_user_text = document.querySelector('li.today-no-user-text span');
            console.log(today_no_user_text);
            if (today_no_user_text != null) {
                today_no_user_text.innerHTML = `${parseInt(today_no_user_text.innerHTML) - 1}`;
            }
            no_user_todo_div.remove();
        }
        closeEdit();
    }
};

//할 일 수정 ajax
const reqEditTodo = new XMLHttpRequest();

function editTodoBtn(event, select_date) {
    todo_id = edit_btn.classList[3];
    const form = new FormData(document.querySelector('#setToDoModal form'));
    var form_data = serialize(form);
    console.log(form_data);

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
};

reqEditTodo.onreadystatechange = () => {
    if (reqEditTodo.readyState === XMLHttpRequest.DONE) {
        editHandleResponse();
    }
};

const editHandleResponse = () => {
    if (reqEditTodo.status < 400) {
        console.log('response is coming');
        const {current_user_id, current_cate_id, user_id, user_profile_url, todo_id, cate_id, cate_name, content, priority_num, priority_content} = JSON.parse(reqEditTodo.response);
        // 1. user가 바뀌는 경우
        // 2. cate가 바뀌는 경우
        // 3. 동일 카테고리 내에서 내용만 바뀜
        if (current_user_id == 'no-user') {
            // 담당없음 내에서만 기능
            var current_todo_div = document.querySelector(`.todo-id-${todo_id}`); 
            current_todo_div = editTodoContentDiv(current_todo_div, content, priority_num, priority_content);
            current_todo_div.querySelector('.todo-bottom p').innerHTML = cate_name;
        }
        else {
            var current_user_todo_div = document.querySelector(`.todo-id-${todo_id}`); 
            var current_doing_todo_div = document.querySelector(`.doing-cate .todo-id-${todo_id}`);

            current_user_todo_div = editTodoContentDiv(current_user_todo_div, content, priority_num, priority_content);
            current_doing_todo_div = editTodoContentDiv(current_doing_todo_div, content, priority_num, priority_content);

            if (current_user_id != user_id) {
                current_user_todo_div.remove();
                if (user_profile_url == null) {
                    current_doing_todo_div.querySelector('.todo-profile-box img').setAttribute('src', "https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=301&q=80");
                }
                else {
                    current_doing_todo_div.querySelector('.todo-profile-box img').setAttribute('src', `${user_profile_url}` );
                    console.log(current_doing_todo_div.querySelector('.todo-profile-box img'));
                    console.log(user_profile_url);
                }
            }
            else if (current_cate_id != cate_id) {
                console.log(cate_id)
                const cate_user_todos_div = document.querySelector(`#cate-id-${cate_id} div.user-todos`);
                cate_user_todos_div.prepend(current_user_todo_div);
            }
        }
        closeEdit();
    }
};

function editTodoContentDiv(current_content_div, content, priority_num, priority_content) {
    const priority_content_p = current_content_div.querySelector(`.user-todo-head p`);
    const priority_icon = current_content_div.querySelector('.user-todo-head i');

    priority_content_p.innerHTML = priority_content;
    priority_icon.setAttribute('class', `fa-solid fa-fire priority-${priority_num}`);

    const contentP = current_content_div.querySelector(`.todo-cnt p`);
    contentP.innerHTML = content;

    return current_content_div;
}



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
};

const doneTodoHandleResponse = (todo_id, todo_content, todo_is_done_date, todo_is_postpone) =>{
    console.log('response is coming');
    window.location.reload();
};

// 담당자 추가하기
function setAddUserBtn(event, todo_id, select_date) {
    const accpet_add_user_btn = document.querySelector('.accept-add-user-btn');
    accpet_add_user_btn.setAttribute('onclick', `addUserBtn(this, '${todo_id}', '${select_date}')`);
};


async function addUserBtn(event, todo_id, select_date) {
    const form = new FormData(document.querySelector('#addUserModal form'));
    var form_data = serialize(form);
    const url = `/home/todo/${select_date}/${todo_id}/add_user/`
    const res = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'todo_id' : todo_id,
            'form_data' : form_data,
        })
    })
    const {
        current_user_id : current_user_id,
        todo_id : current_todo_id,
        user_profile_url : user_profile_url,
        user_id : user_id,
    } = await res.json()
    addUserHandleResponse(current_user_id, current_todo_id, user_profile_url, user_id);
};

function addUserHandleResponse(current_user_id, todo_id, user_profile_url, user_id) {

    if (current_user_id ==  user_id) {
        window.location.reload();
    }
    else {
        const current_todo_div = document.querySelector(`.no-user-cate .todo-id-${todo_id}`);
        current_todo_div.querySelector('.todo-bottom').remove();

        const todo_profile_div = document.createElement('div');
        todo_profile_div.classList = 'todo-profile-box';

        const profile_img = document.createElement('img');
        profile_img.setAttribute('class', "cal-profile-img");
        profile_img.setAttribute('src', `${user_profile_url}`);

        todo_profile_div.appendChild(profile_img);
        current_todo_div.querySelector('.todo-plus-btn').remove();
        current_todo_div.querySelector('.todo-cnt').prepend(todo_profile_div);

        const doing_cate_div = document.querySelector('.doing-cate');
        doing_cate_div.querySelector('p.cate-name').after(current_todo_div);
    }
};