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