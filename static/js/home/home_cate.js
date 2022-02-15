var is_checked = false;
const check_cate_btn = document.querySelector('.check-cate-name-btn');
const accpet_add_cate_btn = document.querySelector('.cate-add-accept-btn');
const cate_name_input = document.querySelector('.cate-name-input');
const cate_list = document.querySelector('.cate-list');
const check_content = document.createElement('p');
const cates_div = document.querySelector('.user-cate-container');


//  alert 발생 시 return false로 해줘야 refresh 안일어남!
// 할 일 추가 ajax
async function addCateBtn() {
    if (!is_checked || is_change_input) {
        alert('중복 체크를 먼저 해주세요');
        return false;
    }
    else {
        const url = "../add_cate/"
        const res = await fetch(url,{
            method : 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                'new_catename' : cate_name_input.value,
            })
        })
        const {
            user_id : user_id,
            cate_id : cate_id,
            new_catename : new_catename
        } = await res.json()
        addCateNameHandleResponse(user_id, cate_id, new_catename);
    }
}

const addCateNameHandleResponse = (user_id, cate_id, new_catename) => {   
    // 기타 카테고리 앞에 새로운 카테고리 넣기
    const etc_cate = cates_div.querySelector('.etc-cate');
    const add_todo_div = etc_cate.querySelector('.add-todo');
    
    const new_cate_div = document.createElement('div');
    new_cate_div.setAttribute('id', `cate-id-${cate_id}`);
    new_cate_div.setAttribute('class', 'cate user-todo');

    const new_cate_name = document.createElement('p');
    new_cate_name.innerHTML = new_catename;
    new_cate_name.setAttribute('class', 'cate-name');
    var new_add_todo_div = document.createElement('div');
    new_add_todo_div = add_todo_div;
    new_add_todo_div.setAttribute('onclick', `setAddBtn(this, ${cate_id}, ${new_catename}, ${user_id})`);

    new_cate_div.appendChild(new_cate_name);
    new_cate_div.appendChild(add_todo_div);
    etc_cate.before(new_cate_div)
}

var is_change_input = true;
function checkInputChange() {
    is_change_input = false;
    check_content.innerHTML = "";
    accpet_add_cate_btn.setAttribute('data-bs-dismiss', '');
}

const checkCateName = async() => {
    check_input = cate_name_input.value;
    if(cate_name_input.value =="") {
        alert('빈 칸은 카테고리 이름으로 사용할 수 없어요');
        return false;
    }
    const url = "../check_catename/"
    console.log(url);
    const res = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'new_catename' : cate_name_input.value,
        })
    })
    const {
        exist_catename: exist_catename
    } = await res.json()
    checkCateNameHandleResponse(exist_catename);
}

const checkCateNameHandleResponse = (exist_catename) => {
    check_content.innerHTML = "";
    accpet_add_cate_btn.setAttribute('data-bs-dismiss', '');

    if (exist_catename ) {
        is_checked = false;
        check_content.style.color = "red";
        check_content.innerHTML = '이미 존재하는 카테고리 이름입니다'
        cate_list.style.display = 'block';
        check_cate_btn.after(check_content);
    } else {
        is_checked = true;
        check_content.style.color = "green";
        check_content.innerHTML = '사용가능한 이름입니다'
        accpet_add_cate_btn.setAttribute('data-bs-dismiss', 'modal');
        check_cate_btn.after(check_content);
    }
}
