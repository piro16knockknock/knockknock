/*초대 링크 */
const link_input = document.getElementById('myhome-register__link-input');
if(link_input){
    link_input.addEventListener('keyup', function(event){ //엔터시에도
        console.log("here");
        if (event.code === "Enter") {
            onClickKnockLinkSearch();
        }  
    });
    
}

const onClickKnockLinkSearch = async() => {
    const url = "../../myhome/knock_link_search/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'link_input': link_input.value
        })
    });
    const {
        is_exist : is_exist
    } = await res.json()
    knockLinkHandleResponse(is_exist);
}

const knockLinkHandleResponse = (is_exist) => {
    if(is_exist){
        location.href = link_input.value;
    }else{
        alert("없는 초대링크 입니다.");
    }

}


/**집 노크하기(검색하기) */
/*집 검색창 - ajax*/
const search_input = document.querySelector('#myhome-register__search-input');
if(search_input){
    search_input.addEventListener("keyup", (e) => {
        if (search_input.value == "") return;
        onSearchHomeList(search_input.value);
    });    
}

const onSearchHomeList = async (value) => {
    const url = "../../myhome/search_home/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'search_word': value
        })
    });
    const {
        home_list: home_list
    } = await res.json()
    searchHomeListHandleResponse(home_list);
}

const searchHomeListHandleResponse = (home_list) => {
    //list 보여줌
    const div = document.querySelector('.form-check');
    div.innerHTML = "";
    for (let i = 0; i < home_list.length; i++) {
        const li = document.createElement('div');
        li.classList.add('myhome-register__home-list');

        li.innerHTML = `<input class="form-radio-input" type="radio" name="homename" value="${home_list[i]['homename']}">
                    <i class="fas fa-home"></i>
                    <p>${home_list[i]['homename']}</p>`;
        div.appendChild(li);
    }
}


const onClickKnockHome = async() => {
    const input = document.querySelector('.form-radio-input');
    if(!input) return;
    const url = "../../myhome/knock_home/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'homename': input.value
        })
    });
    window.location.href = "/";
}










/**집 등록하기 */
const home_name = document.getElementById('myhome-register-name');
const rent_month = document.getElementById('myhome-register-rent-month');
const rent_date = document.getElementById('myhome-register-rent-date');

//현재의 리스트(새로 추가한건 반영 X)
let utility_count = 1;

const deleteUtility = (tag) => {
    tag.parentElement.remove();
    utility_count--;
    if(utility_count < 10){
        const plusBtn = document.querySelector(".myhome-register__row__add-utility");
        plusBtn.classList.remove("myhome-register__display-none");
    }
}

const addUtility = (tag) => {
    const ul = document.querySelector('.myhome-register__row__utility-ul');
    const li = document.createElement('li');
    li.className = 'myhome-register__row__rent myhome-register__row__utility-li';
    li.innerHTML = `
        <div class="myhome-register__row__rent-type"><span>종류</span><input class="new-utility-name" class="new-utility-name" name="utility_name" type="text" maxlength="10"/></div>
        <input class="new-utility-month" name="utility_month" type="number"/> <span>개월마다</span>
        <input class="new-utility-date" name="utility_date" type="number"/> <span>일</span>
        <i class="fas fa-minus-square" onclick="deleteUtility(this)" ></i>
    `;

    /*input valid 검사 */
    ul.appendChild(li);
    utility_count++;
    utility_check(0, utility_count);
    if(utility_count >= 10){
        tag.classList.add("myhome-register__display-none");
    }
}

/* 전세/월세 선택*/
const onSelectUtilityOrRent = (event) => {
    const rent_div = document.querySelector('.myhome-register__row.myhome-register__row__rent');
    if (event.target.value == "전세") {
        rent_div.classList.add('myhome-register__display-none');
    } else {
        rent_div.classList.remove('myhome-register__display-none');
    }
}

/* input창 제한 걸기 */
let replaceNotInt = /[^0-9]/gi; // 숫자 아닌 정규식
let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
if(home_name){
    home_name.addEventListener("keyup", (event) => {
        home_name.value = home_name.value.replace(replaceChar, "")
    })
    utility_check(0, 1);
}

if(rent_month){
    rent_month.addEventListener("keyup", (event) => {
        rent_month.value = rent_month.value.replace(replaceNotInt, "");
        if( rent_month.value != "" && (rent_month.value > 12 || rent_month.value < 1)) {
            rent_month.value = rent_month.value.slice(0, -1);
        }
    })    
}

if(rent_date){
    rent_date.addEventListener("keyup", (event) => {
        rent_date.value = rent_date.value.replace(replaceNotInt, "");
        if( rent_date.value != "" && (rent_date.value > 31 || rent_date.value < 1)) {
            rent_date.value = rent_date.value.slice(0, -1);
        }
    })    
}

function utility_check(start, end){
    const utility_name = document.querySelectorAll('.new-utility-name');
    const utility_month = document.querySelectorAll('.new-utility-month');
    const utility_date = document.querySelectorAll('.new-utility-date');
    for(let i = start ; i < end ; i++){
        utility_name[i].addEventListener("keyup", (event) => {
            utility_name[i].value = utility_name[i].value.replace(replaceChar, "");
        })
    
        utility_month[i].addEventListener("keyup", (event) => {
            utility_month[i].value = utility_month[i].value.replace(replaceNotInt, "");
            if (utility_month[i].value != "" && (utility_month[i].value > 12 || utility_month[i].value < 1)) {
                utility_month[i].value = utility_month[i].value.slice(0, -1);
            }
        })
    
        utility_date[i].addEventListener("keyup", (event) => {
            utility_date[i].value = utility_date[i].value.replace(replaceNotInt, "");
            if (utility_date[i].value != "" && (utility_date[i].value > 31 || utility_date[i].value < 1)) {
                utility_date[i].value = utility_date[i].value.slice(0, -1);
            }
        })
    }    
}

/*중복이름 체크*/
let check_name = "" //중복검사를 통과한 이름
const onClickCheckHomeName = async() => {
    if(home_name.value == "") return;
    const url = "../../myhome/check_homename/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'home_name' : home_name.value
        })
    });
    const { is_available: is_available, input_name: input_name } = await res.json()
    checkHomeNameHandleResponse(is_available, input_name);
}

const checkHomeNameHandleResponse = (is_available, input_name) => {
    const alert = document.querySelector('#myhome-register-alert');
    
    if(is_available){
        alert.innerHTML=" 사용할 수 있는 이름입니다. ";
        alert.style.color="green";
        check_name = input_name;
        
        return;
    }
    else{
        alert.innerHTML=" 이미 사용 중인 이름입니다. ";
        alert.style.color="red";
    }
    // 중복임 =>경고
    home_name.value = "";
}

// 집 등록 클릭 시
const homeRegisterHandleSubmit = (event) => {
    const rent_checked = document.querySelector('#myhome-info__rent-checked');
    
    const utility_li = document.querySelectorAll('.myhome-register__row__utility-li');
    const utility_name = document.querySelectorAll('.new-utility-name');
    const utility_month = document.querySelectorAll('.new-utility-month');
    const utility_date = document.querySelectorAll('.new-utility-date');

    let is_rent;
    if (rent_checked.checked) {
        is_rent = true;
    } else {
        is_rent = false;
    }

    //월세
    if (is_rent && (rent_month.value == "" || rent_date.value == "")) { //월세 체크했는데 빈칸일 때. 전세 체크했을 땐 빈칸이어도 됨
        alert('입력하지 않은 항목이 있습니다.');
        event.preventDefault();
        return;
    }

    for(let i = 0 ; i < utility_li.length ; i++){
        if (utility_month[i].value == "" || utility_date[i].value == "" || utility_name[i].value == "") {
            alert('입력하지 않은 항목이 있습니다.');
            event.preventDefault();
            return;
        }
    }

    if (home_name.value == "") {
        alert('입력하지 않은 항목이 있습니다.');
        event.preventDefault();
        return;
    }
    
    if (home_name.value != check_name ){
        alert("집 이름 중복 확인을 먼저 해주세요.");
        event.preventDefault();
        return;
    }
}
