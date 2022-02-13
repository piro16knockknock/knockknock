
const home_name = document.getElementById('myhome-register-name');
const rent_month = document.getElementById('myhome-register-rent-month');
const rent_date = document.getElementById('myhome-register-rent-date');
const utility_name = document.getElementById('myhome-register-utility-name');
const utility_month = document.getElementById('myhome-register-utility-month');
const utility_date = document.getElementById('myhome-register-utility-date');
let check_name = "" //중복검사를 통과한 이름

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
//let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi; // 특수문자 정규식 변수(공백 미포함)
let replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
//let replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi; // 완성형 아닌 한글 정규식
home_name.addEventListener("keyup", (event) => {
    home_name.value = home_name.value.replace(replaceChar, "")
})
utility_name.addEventListener("keyup", (event) => {
    utility_name.value = utility_name.value.replace(replaceChar, "")
})
rent_month.addEventListener("keyup", (event) => {
    rent_month.value = rent_month.value.replace(replaceNotInt, "");
    if( rent_month.value != "" && (rent_month.value > 12 || rent_month.value < 1)) {
        rent_month.value = rent_month.value.slice(0, -1);
    }
})
utility_month.addEventListener("keyup", (event) => {
    utility_month.value = utility_month.value.replace(replaceNotInt, "");
    if( utility_month.value != "" && (utility_month.value > 12 || utility_month.value < 1)) {
        utility_month.value = utility_month.value.slice(0, -1);
    }
})
rent_date.addEventListener("keyup", (event) => {
    rent_date.value = rent_date.value.replace(replaceNotInt, "");
    if( rent_date.value != "" && (rent_date.value > 31 || rent_date.value < 1)) {
        rent_date.value = rent_date.value.slice(0, -1);
    }
})
utility_date.addEventListener("keyup", (event) => {
    utility_date.value = utility_date.value.replace(replaceNotInt, "");
    if( utility_date.value != "" && (utility_date.value > 31 || utility_date.value < 1)) {
        utility_date.value = utility_date.value.slice(0, -1);
    }
})

/*중복이름 체크*/
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
        
        console.log(input_name);
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

    if (home_name.value == "" || utility_month.value == "" || utility_date.value == "") {
        alert('입력하지 않은 항목이 있습니다.');
        return;
    }
    
    if (home_name.value != check_name ){
        alert("집 이름 중복 확인을 먼저 해주세요.");
        return;
    }
}
