
// 우리가 잡아서 쓰는 부분
var user_ratio_element = document.querySelectorAll('.user-ratio .chart');
var total_ratio_element = document.querySelectorAll('.total-ratio .chart');

for(let i = 0 ; i < user_ratio_element.length ; i++){
    new EasyPieChart(total_ratio_element[i], {
        'lineWidth' : 20,
        'lineCap' : 'butt',
        'barColor' : '#75AFF2',
        'size' : 150,
     })
    new EasyPieChart(user_ratio_element[i], {
       'lineWidth' : 20,
       'lineCap' : 'butt',
       'barColor' : '#FFC163',
       'size' : 150,
    });
}
