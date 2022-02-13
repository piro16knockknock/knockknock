function prevDate(select_date) {
    today = new Date(select_date);
    var prevDay = new Date(today);
    prevDay.setDate(prevDay.getDate()-1);
    date_string = makeDateFormat(prevDay);

    prev_btn = document.querySelector('.prev-date-btn a');
    prev_btn.href = `./${date_string}`;
}

function nextDate(select_date) {
    today = new Date(select_date);
    var nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate()+1);
    date_string = makeDateFormat(nextDay);

    next_btn = document.querySelector('.next-date-btn a');
    next_btn.href = `./${date_string}`;
}

function makeDateFormat(day) {
    const year = day.getFullYear();
    const month = day.getMonth();
    const date = day.getDate(); 

    return `${year}-${month+1}-${date}`
}