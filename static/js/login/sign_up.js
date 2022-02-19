// 아이디 중복확인 시작
const user_name = document.getElementById('signup-register-name');

const search_input = document.querySelector('#signup-register__search-input');
if(search_input){
    search_input.addEventListener("keyup", (e) => {
        if (search_input.value == "") return;
        onSearchHomeList(search_input.value);
    });    
}


let check_name = ""
const onClickCheckUserName = async() => {
  if(user_name.value == "") return;
  const url = "check_username/";
  const res = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
          'user_name' : user_name.value
      })
  });
  const { is_available: is_available, input_name: input_name } = await res.json()
  checkUserNameHandleResponse(is_available, input_name);
}

const checkUserNameHandleResponse = (is_available, input_name) => {
  const alert = document.querySelector('#signup-register-alert');
  
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
  user_name.value = "";
}

const userRegisterHandleSubmit = (event) => {
  
  if (user_name.value == "") {
      alert('입력하지 않은 항목이 있습니다.');
      event.preventDefault();
      return;
  }
  
  if (user_name.value != check_name ){
      alert("아이디 중복 확인을 먼저 해주세요.");
      event.preventDefault();
      return;
  }
}
// 아이디 중복확인 끝


// 이메일 중복확인 시작
const email = document.getElementById('signup-register-email');

const search_input2 = document.querySelector('#signup-register__search-input');
if(search_input2){
    search_input2.addEventListener("keyup", (e) => {
        if (search_input2.value == "") return;
        onSearchHomeList(search_input2.value);
    });    
}


let check_email = ""
const onClickCheckUserEmail = async() => {
  if(email.value == "") return;
  const url = "check_email/";
  const res = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
          'email' : email.value
      })
  });
  const { is_available: is_available, input_email: input_email } = await res.json()
  checkUserEmailHandleResponse(is_available, input_email);
}

const checkUserEmailHandleResponse = (is_available, input_email) => {
  const alert = document.querySelector('#signup-register-alert2');
  
  if(is_available){
      alert.innerHTML=" 사용할 수 있는 이메일입니다. ";
      alert.style.color="green";
      check_email = input_email;
      
      return;
  }
  else{
      alert.innerHTML=" 이미 사용 중인 이메일입니다. ";
      alert.style.color="red";
  }
  // 중복임 =>경고
  email.value = "";
}

const emailRegisterHandleSubmit = (event) => {
  
  if (email.value == "") {
      alert('입력하지 않은 항목이 있습니다.');
      event.preventDefault();
      return;
  }
  
  if (email.value != check_email ){
      alert("이메일 중복 확인을 먼저 해주세요.");
      event.preventDefault();
      return;
  }
}
// 이메일 중복확인 끝

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
  const url = "check_nick_name/";
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