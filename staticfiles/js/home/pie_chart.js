
// 우리가 잡아서 쓰는 부분
var user_ratio_element = document.querySelector('.user-ratio .chart');
var total_ratio_element = document.querySelector('.total-ratio .chart');

new EasyPieChart(total_ratio_element, {
    'lineWidth' : 20,
    'lineCap' : 'butt',
    'barColor' : '#75AFF2',
    'size' : 150,
 })
new EasyPieChart(user_ratio_element, {
   'lineWidth' : 20,
   'lineCap' : 'butt',
   'barColor' : '#FFC163',
   'size' : 150,
});