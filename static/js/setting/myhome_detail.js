const home_name = document.querySelector('#new-home-name');
const rent_month = document.querySelector('#new-rent-month');
const rent_date = document.querySelector('#new-rent-date');

//현재의 리스트(새로 추가한건 반영 X)
const utility_li = document.querySelectorAll('.myhome-detail__row__utility-li');
let utility_count = utility_li.length;

const deleteUtility = (tag) => {
    tag.parentElement.remove();
    utility_count--;
    if(utility_count < 10){
        const plusBtn = document.querySelector(".myhome-detail__row__add-utility");
        plusBtn.classList.remove("myhome-detail__display-none");
    }
}

const addUtility = (tag) => {
    const ul = document.querySelector('.myhome-detail__row__utility-ul');
    const li = document.createElement('li');
    li.className = 'myhome-detail__row__rent myhome-detail__row__utility-li';
    li.innerHTML = `
        <div class="myhome-detail__row__rent-type"><span>종류</span><input class="new-utility-name" name="utility_name" type="text" maxlength="10"/></div>
        <input type="number" class="new-utility-month" min="1"
            max="12" /><span>개월마다</span>
        <input type="number" class="new-utility-date" min="1"
            max="31" /><span>일</span>
        <i class="fas fa-minus-square" onclick="deleteUtility(this)" ></i>
    `;

    /*input valid 검사 */
    ul.appendChild(li);
    utility_count++;
    utility_check(0, utility_count);
    if(utility_count >= 10){
        tag.classList.add("myhome-detail__display-none");
    }
}

/* 전세/월세 선택*/
const onSelectUtilityOrRent = (event) => {
    const rent_div = document.querySelector('.myhome-detail__row.myhome-detail__row__rent');
    if (event.target.value == "전세") {
        rent_div.classList.add('myhome-detail__display-none');
    } else {
        rent_div.classList.remove('myhome-detail__display-none');
    }
}
/* input창 제한 걸기 */
let replaceNotInt = /[^0-9]/gi; // 숫자 아닌 정규식
let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

home_name.addEventListener("keyup", (event) => {
    home_name.value = home_name.value.replace(replaceChar, "")
})
rent_month.addEventListener("keyup", (event) => {
    rent_month.value = rent_month.value.replace(replaceNotInt, "");
    if (rent_month.value != "" && (rent_month.value > 12 || rent_month.value < 1)) {
        rent_month.value = rent_month.value.slice(0, -1);
    }
})

rent_date.addEventListener("keyup", (event) => {
    rent_date.value = rent_date.value.replace(replaceNotInt, "");
    if (rent_date.value != "" && (rent_date.value > 31 || rent_date.value < 1)) {
        rent_date.value = rent_date.value.slice(0, -1);
    }
})

utility_check(0, utility_count);
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
    

/* 집 정보 변경 ajax */
let check_name = "" //중복검사를 통과한 이름
const onClickSaveHome = (current_name) => {
    const rent_checked = document.querySelector('#myhome-info__rent-checked');
    
    const utility_li = document.querySelectorAll('.myhome-detail__row__utility-li');
    const utility_name = document.querySelectorAll('.new-utility-name');
    const utility_month = document.querySelectorAll('.new-utility-month');
    const utility_date = document.querySelectorAll('.new-utility-date');
    
    let temp_home_name = "";

    let is_rent;
    if (rent_checked.checked) {
        is_rent = true;
    } else {
        is_rent = false;
    }

    //월세
    if (is_rent && (rent_month.value == "" || rent_date.value == "")) { //월세 체크했는데 빈칸일 때. 전세 체크했을 땐 빈칸이어도 됨
        alert('입력하지 않은 항목이 있습니다.');
        return;
    }

    //공과금
    utility_name_list = []
    utility_month_list = []
    utility_date_list = []

    for(let i = 0 ; i < utility_li.length ; i++){
        if (utility_month[i].value == "" || utility_date[i].value == "" || utility_name[i].value == "") {
            alert('입력하지 않은 항목이 있습니다.');
            return;
        }
        utility_name_list.push(utility_name[i].value);
        utility_month_list.push(utility_month[i].value);
        utility_date_list.push(utility_date[i].value);
    }

    //집이름을 입력했는데 중복이면 안됨.
    if (home_name.value != "" && home_name.value != check_name) {
        alert("집 이름 중복 확인을 먼저 해주세요.");
        return;
    }

    //집이름은 입력 안했으면 그냥 변경 안하는걸로 간주
    if (home_name.value == "") {
        temp_home_name = current_name;
    } else {
        temp_home_name = home_name.value;
    }

    onClickSaveHomeAjax(temp_home_name, is_rent, rent_month.value, rent_date.value, utility_name_list, utility_month_list, utility_date_list);
}
const onClickSaveHomeAjax = async (temp_home_name, is_rent, rent_month_value, rent_date_value, utility_name_list, utility_month_list, utility_date_list) => {
    const url = "../../myhome/myhome_update/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'home_name': temp_home_name,
            'is_rent' : is_rent,
            'rent_month': rent_month_value,
            'rent_date': rent_date_value,
            'utility_name': utility_name_list,
            'utility_month': utility_month_list,
            'utility_date': utility_date_list,
        })
    });
    const {
        home_name: new_home_name
    } = await res.json()
    saveHomeHandleResponse(new_home_name);
}

const saveHomeHandleResponse = (new_home_name) => {
    const current_name = document.querySelector('#myhome-info__current-home-name');
    current_name.innerText = new_home_name;
    home_name.value = "";
}


/*초대 검색창 - ajax*/
const search_input = document.querySelector('#myhome-roommate-invite__input');
search_input.addEventListener("keyup", (e) => {
    if (search_input.value == "") return;
    onSearchUserList(search_input.value);
});

const onSearchUserList = async (value) => {
    const url = "../../myhome/search_user/";
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
        user_list: user_list
    } = await res.json()
    searchUserListHandleResponse(user_list);
}

const searchUserListHandleResponse = (user_list) => {
    //list 보여줌
    const div = document.querySelector('.form-check');
    div.innerHTML = "";
    for (let i = 0; i < user_list.length; i++) {
        const li = document.createElement('div');
        li.classList.add('myhome-roommate__modal-user-list');

        if (user_list[i]['profile'] == "") { //프로필이 없으면
            //원래는 <i class="fas fa-user-circle"></i>였지만
            li.innerHTML = `<input class="form-check-input" type="checkbox" value="${user_list[i]['nickname']}" onclick='getCheckboxValue(event)' id="flexCheckDefault">
                        <img class="cal-profile-img" src="https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=301&q=80"/>
                        <p>${user_list[i]['nickname']}</p>`;

        } else {
            li.innerHTML = `<input class="form-check-input" type="checkbox" value="${user_list[i]['nickname']}" onclick='getCheckboxValue(event)' id="flexCheckDefault">
                        <img src="${user_list[i]['profile']}"/>
                        <p>${user_list[i]['nickname']}</p>`;
        }
        div.appendChild(li);
    }
}

/*초대 ajax*/
//초대를 위해 체크한 사람들 목록
let checkedNickName = [];
const getCheckboxValue = (event) => {
    if (event.target.checked) {
        checkedNickName.push(event.target.value);
    } else {
        checkedNickName = checkedNickName.filter(function (item) {
            return item !== event.target.value;
        });
    }
}

const onClickInvite = async () => {
    if (checkedNickName.length == 0) return; //아무것도 체크 X
    const url = "../../myhome/invite_roommate/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'invite_list': checkedNickName
        })
    });
    checkedNickName = [];
}

/*부트스트랩 모달 닫힘 이벤트 감지*/
const invite_modal_close = document.querySelector('#roommateAddModal');
invite_modal_close.addEventListener('hidden.bs.modal', () => {
    search_input.value = "";
    const div = document.querySelector('.form-check');
    div.innerHTML = "";
})


/* 집이름 중복 확인*/
const onClickCheckHomeName = async () => {
    if (home_name.value == "") return;
    const url = "../../myhome/check_homename/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'home_name': home_name.value
        })
    });
    const {
        is_available: is_available,
        input_name: input_name
    } = await res.json()
    checkHomeNameHandleResponse(is_available, input_name);
}

const checkHomeNameHandleResponse = (is_available, input_name) => {
    const alert = document.querySelector('#myhome-detail-alert');

    if (is_available) {
        alert.innerHTML = " 사용할 수 있는 이름입니다. ";
        alert.style.color = "green";
        check_name = input_name;
        return;
    } else {
        alert.innerHTML = " 이미 사용 중인 이름입니다. ";
        alert.style.color = "red";
    }
    // 중복임 =>경고
    home_name.value = "";
}


/* 초대 링크 복사 */
const copyBtn = document.querySelector('#roommate-invite-url-copy');
const linkInput = document.querySelector('#myhome-roommate-link__input');
linkInput.value = window.location.href + linkInput.value;
copyBtn.addEventListener('click', function (event){
    linkInput.select();
    window.navigator.clipboard.writeText(linkInput.value);
})



/*노크 수락*/
const onAcceptKnock = async(tag) => {
    user_id = tag.dataset.id
    
    const url = "../../myhome/accept_knock/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'user_id': user_id,
        })
    });
    const {
        'user_name' : user_name,
        'profile' : profile,
   } = await res.json()
    acceptKnockHandleResponse(user_name, profile, user_id);
}
const acceptKnockHandleResponse = (user_name, profile, user_id) => {
    const deleteDiv = document.querySelector(`div[data-id="${user_id}"]`);
    deleteDiv.remove();

    //추가 버튼 앞에 넣어주기
    const afterDiv = document.querySelector('.myhome-roommate__invite');
    const newDiv = document.createElement('div');
    newDiv.className = 'myhome-roommate__column';
    if(profile == ""){ // 프로필 없음
        newDiv.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <p>${user_name}</p>
        `;
    }else {
        newDiv.innerHTML = `
            <img src="${ profile }" />
            <p>${user_name}</p>
        `;        
    }
    afterDiv.before(newDiv);
    
    //노크중인 유저가 0명이 된다면
    const knockRow = document.querySelector('.myhome-knock__row');
    const knockColumn = document.querySelectorAll('.myhome-knock__column');
    
    if(knockColumn.length == 0){
        const p = document.createElement('p');
        p.className = "myhome-knock__empty";
        p.innerHTML = "현재 노크 중인 유저가 없습니다.";
        knockRow.after(p);
        knockRow.remove();
    }
    window.location.reload();

}

/*노크 거절 */
const onRejectKnock = async(tag) => {
    user_id = tag.dataset.id
    
    const url = "../../myhome/reject_knock/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'user_id': user_id,
        })
    });
    const {
        'success' : success
    } = await res.json()
    if(success){
        rejectKnockHandleResponse(user_id);
    }
}
const rejectKnockHandleResponse = (user_id) => {
    const deleteDiv = document.querySelector(`div[data-id="${user_id}"]`);
    deleteDiv.remove();
    
    //노크중인 유저가 0명이 된다면
    const knockRow = document.querySelector('.myhome-knock__row');
    const knockColumn = document.querySelectorAll('.myhome-knock__column');
    
    if(knockColumn.length == 0){
        const p = document.createElement('p');
        p.className = "myhome-knock__empty";
        p.innerHTML = "현재 노크 중인 유저가 없습니다.";
        knockRow.after(p);
        knockRow.remove();
    }
    window.location.reload();
}