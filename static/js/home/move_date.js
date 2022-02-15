function prevDate(select_date) {
    var today = new Date();
    var select_day = new Date(select_date);
    var prevDay = new Date(select_day);
    prevDay.setDate(prevDay.getDate()-1);
    date_string = makeDateFormat(prevDay);

    prev_btn = document.querySelector('.prev-date-btn a');

    if (checkisPrevDate(today, prevDay)) {
        prev_btn.href = `../prev_todo/${date_string}`;
    } else {
        prev_btn.href = `../todo/${date_string}`;
    }
};

function nextDate(select_date) {
    var today = new Date();
    var select_day = new Date(select_date);
    var nextDay = new Date(select_day);
    nextDay.setDate(nextDay.getDate()+1);
    date_string = makeDateFormat(nextDay);

    next_btn = document.querySelector('.next-date-btn a');
    if (checkisPrevDate(today, nextDay)) {
        next_btn.href = `../prev_todo/${date_string}`;
    } else {
        next_btn.href = `../todo/${date_string}`;
    }
};

function makeDateFormat(day) {
    const year = day.getFullYear();
    const month = day.getMonth();
    const date = day.getDate(); 

    return `${year}-${month+1}-${date}`
};

function checkisPrevDate(today, select_date) {
    today_date = parseInt(today.getDate());
    today_month = parseInt(today.getMonth()+1);
    today_year = parseInt(today.getFullYear());

    select_date_date = parseInt(select_date.getDate());
    select_date_month = parseInt(select_date.getMonth()+1);
    select_date_year = parseInt(select_date.getFullYear());

    if (today_year > select_date_year || today_month > select_date_month || today_date > select_date_date) {
        return true
    }
    else {
        return false
    }
};