from datetime import datetime, timedelta
from calendar import HTMLCalendar
from .models import Todo

class Calendar(HTMLCalendar):
	def __init__(self, year=None, month=None):
		self.year = year
		self.month = month
		super(Calendar, self).__init__()

	# formats a day as a td
	# filter events by day
	def formatday(self, day, events):
		event_count =events.filter(date__day=day).count()
		d = ''
		d += f'<a>{event_count}</a>'
		print(day)
		date_content = f"<span>{day}</span><p> 할일 개수 :{d}</p>"
		date_content += "<a href=\"#\">할 일 +</a>"
		if day != 0:
			return f"<td>{date_content}</td>"
		return '<td></td>'

	# formats a week as a tr
	def formatweek(self, theweek, events):
		week = ''
		for d, weekday in theweek:
			week += self.formatday(d, events)
		return f'<tr> {week} </tr>'

	# formats a month as a table
	# filter events by year and month
	def formatmonth(self, withyear=True):
		events = Todo.objects.filter(date__year=self.year, date__month=self.month)

		cal = f'<table border="0" cellpadding="0" cellspacing="0" class="calendar">\n'
		cal += f'{self.formatweekheader()}\n'
		for week in self.monthdays2calendar(self.year, self.month):
			cal += f'{self.formatweek(week, events)}\n'
		return cal
