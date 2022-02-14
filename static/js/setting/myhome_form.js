
const home_name = document.getElementById('myhome-register-name');
const rent_month = document.getElementById('myhome-register-rent-month');
const rent_date = document.getElementById('myhome-register-rent-date');

//현재의 리스트(새로 추가한건 반영 X)
let utility_count = 1;

const deleteUtility = (tag) => {
    tag.parentElement.remove();
    utility_count--;
    if(utility_count < 5){
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
    if(utility_count >= 5){
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
home_name.addEventListener("keyup", (event) => {
    home_name.value = home_name.value.replace(replaceChar, "")
})

rent_month.addEventListener("keyup", (event) => {
    rent_month.value = rent_month.value.replace(replaceNotInt, "");
    if( rent_month.value != "" && (rent_month.value > 12 || rent_month.value < 1)) {
        rent_month.value = rent_month.value.slice(0, -1);
    }
})

rent_date.addEventListener("keyup", (event) => {
    rent_date.value = rent_date.value.replace(replaceNotInt, "");
    if( rent_date.value != "" && (rent_date.value > 31 || rent_date.value < 1)) {
        rent_date.value = rent_date.value.slice(0, -1);
    }
})

utility_check(0, 1);
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
