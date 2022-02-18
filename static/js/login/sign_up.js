const user_name = document.getElementById('signup-register-name');
const email = document.getElementById('signup-register-email');

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
