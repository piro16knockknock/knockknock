from datetime import date, datetime, timedelta
from calendar import HTMLCalendar
from .models import Todo

class Calendar(HTMLCalendar):
	def __init__(self, year=None, month=None):
		self.year = year
		self.month = month
		self.today = datetime.now()
		super(Calendar, self).__init__()

	# formats a day as a td
	# filter events by day
	def formatday(self, day, events, year, month):
		event_count =events.filter(date__day=day).count()
		date = str(year) + "-" + str(month) + "-" + str(day)
		d = ''
		d += f'<a>{event_count}</a>'
		date_content = f"<span>{day}</span><p> 할일 개수 :{d}</p>"
		if (year==self.today.year) and (month == self.today.month) and (day == self.today.day):
			date_content += '<p style="font-weight: bold">오늘<p>'
		if (year < self.today.year) or (month < self.today.month) or (day < self.today.day):
			date_content += "<a href=\"/home/prev_todo/" + f"{date}" + "\"> 할 일 <i class=\"fa-solid fa-square\"></i></a>"
		else:
			date_content += "<a href=\"/home/todo/" + f"{date}" + "\"> 할 일 <i class=\"fa-solid fa-circle-plus\"></i></a>"
		if day != 0:
			return f"<td>{date_content}</td>"
		return '<td></td>'

	# formats a week as a tr
	def formatweek(self, theweek, events, year, month):
		week = ''
		for d, weekday in theweek:
			week += self.formatday(d, events, year, month)
		return f'<tr> {week} </tr>'

	# formats a month as a table
	# filter events by year and month
	def formatmonth(self, withyear=True):
		events = Todo.objects.filter(date__year=self.year, date__month=self.month)

		cal = f'<table border="0" cellpadding="0" cellspacing="0" class="calendar">\n'
		cal += f'{self.formatweekheader()}\n'
		for week in self.monthdays2calendar(self.year, self.month):
			cal += f'{self.formatweek(week, events, self.year, self.month)}\n'
		return cal
