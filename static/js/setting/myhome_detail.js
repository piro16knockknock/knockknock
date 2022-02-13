const home_name = document.querySelector('#new-home-name');
const rent_month = document.querySelector('#new-rent-month');
const rent_date = document.querySelector('#new-rent-date');
const utility_month = document.querySelector('#new-utility-month');
const utility_date = document.querySelector('#new-utility-date');
let check_name = "" //중복검사를 통과한 이름

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
//let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi; // 특수문자 정규식 변수(공백 미포함)
let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
//let replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi; // 완성형 아닌 한글 정규식
home_name.addEventListener("keyup", (event) => {
    home_name.value = home_name.value.replace(replaceChar, "")
})
rent_month.addEventListener("keyup", (event) => {
    rent_month.value = rent_month.value.replace(replaceNotInt, "");
    if (rent_month.value != "" && (rent_month.value > 12 || rent_month.value < 1)) {
        rent_month.value = rent_month.value.slice(0, -1);
    }
})
utility_month.addEventListener("keyup", (event) => {
    utility_month.value = utility_month.value.replace(replaceNotInt, "");
    if (utility_month.value != "" && (utility_month.value > 12 || utility_month.value < 1)) {
        utility_month.value = utility_month.value.slice(0, -1);
    }
})
rent_date.addEventListener("keyup", (event) => {
    rent_date.value = rent_date.value.replace(replaceNotInt, "");
    if (rent_date.value != "" && (rent_date.value > 31 || rent_date.value < 1)) {
        rent_date.value = rent_date.value.slice(0, -1);
    }
})
utility_date.addEventListener("keyup", (event) => {
    utility_date.value = utility_date.value.replace(replaceNotInt, "");
    if (utility_date.value != "" && (utility_date.value > 31 || utility_date.value < 1)) {
        utility_date.value = utility_date.value.slice(0, -1);
    }
})

/* 집 정보 변경 ajax */
const onClickSaveHome = () => {
    const rent_checked = document.querySelector('#myhome-info__rent-checked');
    let temp_home_name = "";

    let is_rent;
    if (rent_checked.checked) {
        is_rent = true;
    } else {
        is_rent = false;
    }

    //집이름 제외하곤 빈칸이 되어선 안됨
    if (is_rent && (rent_month.value == "" || rent_date.value == "")) { //월세 체크했는데 빈칸일 때. 전세 체크했을 땐 빈칸이어도 됨
        alert('입력하지 않은 항목이 있습니다.');
        return;
    }

    if (utility_month.value == "" || utility_date.value == "") {
        alert('입력하지 않은 항목이 있습니다.');
        return;
    }

    //집이름을 입력했는데 중복이면 안됨.
    if (home_name.value != "" && home_name.value != check_name) {
        event.preventDefault();
        alert("집 이름 중복 확인을 먼저 해주세요.");
        return;
    }

    //집이름은 입력 안했으면 그냥 변경 안하는걸로 간주
    if (home_name.value == "") {
        temp_home_name = "{{ home_name }}";
    } else {
        temp_home_name = home_name.value;
    }

    onClickSaveHomeAjax(temp_home_name, is_rent, rent_month.value, rent_date.value, utility_month.value, utility_date.value);
}
const onClickSaveHomeAjax = async (temp_home_name, is_rent, rent_month_value, rent_date_value, utility_month_value, utility_date_value) => {
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
            'utility_month': utility_month_value,
            'utility_date': utility_date_value,
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

        if (user_list[i]['profile'] == "") {

            li.innerHTML = `<input class="form-check-input" type="checkbox" value="${user_list[i]['nickname']}" onclick='getCheckboxValue(event)' id="flexCheckDefault">
                        <i class="fas fa-user-circle"></i>
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