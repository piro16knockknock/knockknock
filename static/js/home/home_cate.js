var is_checked = false;
const check_cate_btn = document.querySelector('.check-cate-name-btn');
const accpet_add_cate_btn = document.querySelector('.cate-add-accept-btn');
const cate_name_input = document.querySelector('.cate-name-input');
const cate_list = document.querySelector('.cate-list');
const check_content = document.createElement('p');
const cates_div = document.querySelector('.user-cate-container');


//  alert 발생 시 return false로 해줘야 refresh 안일어남!
// 할 일 추가 ajax
function addCateBtn(event, select_date) {
    if (!is_checked || is_change_input) {
        alert('중복 체크를 먼저 해주세요');
        return false;
    }
    else {
        const url = "../add_cate/"
        const res = fetch(url,{
            method : 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                'new_catename' : cate_name_input.value,
                'select_date' : select_date,
            })
        })
        window.location.reload()
    }
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
    const url = "/home/todo/check_catename/"
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

// 카테고리 삭제하기
function cateDeleteBtn(event, cate_id, cate_name) {
    if (confirm(`${cate_name} 카테고리 삭제 후 할 일은 기타 카테고리로 이동합니다`) == true){    //확인
        cateDelete(cate_id);
    }else{
        return false;
    }
};

const cateDelete = async(cate_id) => {
    const url = "/home/todo/delete_cate/"
    console.log(url);
    const res = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'cate_id' : cate_id,
        })
    })
    const {
    } = await res.json()
    window.location.reload();
};