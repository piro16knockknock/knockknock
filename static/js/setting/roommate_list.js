/*캐러셀 JS*/
const container = document.querySelectorAll(".roommate-list__container");
const prevBtn = document.querySelectorAll(".roommate-list__carousel-left");
const nextBtn = document.querySelectorAll(".roommate-list__carousel-right"); 

(function addEvent(){
    if(prevBtn[0]){
        prevBtn[0].addEventListener('click', translateContainer.bind(this, 1, 0));
        nextBtn[0].addEventListener('click', translateContainer.bind(this, -1, 0));
    }
    if(prevBtn[1]){
        prevBtn[1].addEventListener('click', translateContainer.bind(this, 1, 1));
        nextBtn[1].addEventListener('click', translateContainer.bind(this, -1, 1));
    }
})();

function translateContainer(direction, i) {
    const selectedBtn = (direction === 1) ? 'prev' : 'next';
    container[i].style.transitionDuration = '500ms';
    container[i].style.transform = `translateX(${direction * (103)}%)`;
    container[i].ontransitionend = () => reorganizeEl(selectedBtn, i);
}

function reorganizeEl(selectedBtn, i) {
    container[i].removeAttribute('style');
    (selectedBtn === 'prev') ? container[i].insertBefore(container[i].lastElementChild, container[i].firstElementChild): container[i].appendChild(container[i].firstElementChild);
}


/*초대 취소 ajax*/
const onClickInviteCancel = async (id) => {
    const url = "../roommate/invite_cancel/";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            'invite_cancel_id': id
        })
    });
    const {
        id: userId
    } = await res.json()
    inviteCancelHandleResponse(userId);
}


const inviteCancelHandleResponse = (id) => {
    const element = document.querySelector(`.roommate-id-${id}`);
    element.remove();

    //초대중인 유저 0명이 되면
    const invite_users_ul = document.querySelectorAll('.roommate-list__container')[1];
    if(invite_users_ul.children.length==0){
        const carousel = document.querySelectorAll('.roommate-list__carousel')[1];
        const p = document.createElement('p');
        p.className="roommate-list__empty";
        p.innerHTML="초대중인 유저가 없습니다.";
        carousel.after(p);
        carousel.remove();
    }
}