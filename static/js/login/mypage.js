const takePrehomeRecord = (pk) => {
    const record_take_btn = document.querySelector(`#past-record__take-btn-${pk}`);
    const record_save_btn = document.querySelector(`#past-record__save-btn-${pk}`);
    const record_checkboxes = document.querySelectorAll(`.past-record__checkbox-${pk}`);
    record_take_btn.classList.add('past-record__display-none');
    record_save_btn.classList.remove('past-record__display-none');
    for (let i = 0; i < record_checkboxes.length; i++) {
        record_checkboxes[i].classList.remove('past-record__display-none');
    }
}

//저장하기 클릭
const savePrehomeRecord = (pk) => {
    const record_take_btn = document.querySelector(`#past-record__take-btn-${pk}`);
    const record_save_btn = document.querySelector(`#past-record__save-btn-${pk}`);
    const record_checkboxes = document.querySelectorAll(`.past-record__checkbox-${pk}`);
    record_save_btn.classList.add('past-record__display-none');
    record_take_btn.classList.remove('past-record__display-none');

    let checkedRuleList = []
    for (let i = 0; i < record_checkboxes.length; i++) {
        if (record_checkboxes[i].checked) {
            checkedRuleList.push({
                'cate': record_checkboxes[i].dataset.cate,
                'content': record_checkboxes[i].value
            });
        }
        record_checkboxes[i].checked = false; //체크 풀기
        record_checkboxes[i].classList.add('past-record__display-none');
    }
    /*
        checkedRuleList 형태
        [
            {'cate': '청소', 'content': '...'},
            {'cate': '청소', 'content': '...'}
        ]
    */
    //ajax. 체크한 리스트 저장
    onClickSaveRecordBtn(checkedRuleList);
}

const onClickSaveRecordBtn = async (checkedList) => {
    const url = `../../mypage/take_prelivingrule/`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'checked_list': checkedList
        })
    });
}

// 닉네임 중복확인 시작
const nick_name = document.getElementById('signup-register-nick_name');

const search_input3 = document.querySelector('#signup-register__search-input');
if(search_input3){
    search_input3.addEventListener("keyup", (e) => {
        if (search_input3.value == "") return;
        onSearchHomeList(search_input3.value);
    });    
}


let check_nick_name = ""
const onClickCheckNickName = async() => {
  if(nick_name.value == "") return;
  const url = "../signup/check_nick_name/";
  const res = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
          'nick_name' : nick_name.value
      })
  });
  const { is_available: is_available, input_nick_name: input_nick_name } = await res.json()
  checkUserNickNameHandleResponse(is_available, input_nick_name);
}

const checkUserNickNameHandleResponse = (is_available, input_nick_name) => {
  const alert = document.querySelector('#signup-register-alert3');
  
  if(is_available){
      alert.innerHTML=" 사용할 수 있는 닉네임입니다. ";
      alert.style.color="green";
      check_name = input_nick_name;
      
      return;
  }
  else{
      alert.innerHTML=" 이미 사용 중인 닉네임입니다. ";
      alert.style.color="red";
  }
  // 중복임 =>경고
  nick_name.value = "";
}

const nicknameRegisterHandleSubmit = (event) => {
  
  if (nick_name.value == "") {
      alert('입력하지 않은 항목이 있습니다.');
      event.preventDefault();
      return;
  }
  
  if (nick_name.value != check_nick_name ){
      alert("닉네임 중복 확인을 먼저 해주세요.");
      event.preventDefault();
      return;
  }
}
// 닉네임 중복확인 끝