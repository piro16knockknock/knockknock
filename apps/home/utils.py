from datetime import date, datetime, timedelta
from calendar import HTMLCalendar
from .models import Todo

class Calendar(HTMLCalendar):
	def __init__(self, year=None, month=None, home=None):
		self.year = year
		self.month = month
		self.home = home
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
		# 달성한 개수
		complete_todos = events.filter(date__day=day, is_done = True).count()
		# 달성률
		if complete_todos == 0:
			dr = 100
		else:
			dr = 100-int(round(complete_todos /event_count * 100))

		if (year==self.today.year) and (month == self.today.month) and (day == self.today.day):
			date_content += "<a href=\"/home/todo/" + f"{date}" + "\" class=\"go_todo_btn\"> 할 일 <i class=\"fa-solid fa-circle-plus\"></i></a>"
			return f'<td style="background: linear-gradient(to bottom, white {dr}%, #ffefbc 0%" class="cal-today-date"> {date_content}</td>'

		if (year < self.today.year) or (month < self.today.month) or (day < self.today.day):
			date_content += "<a href=\"/home/prev_todo/" + f"{date}" + "\" class=\"go_todo_btn\"> 할 일 <i class=\"fa-solid fa-certificate\"></i></a>"
			
		else:
			date_content += "<a href=\"/home/todo/" + f"{date}" + "\" class=\"go_todo_btn\"> 할 일 <i class=\"fa-solid fa-circle-plus\"></i></a>"

		if day != 0:
			#return f"<td>{date_content}</td>"
			return f'<td style="background: linear-gradient(to bottom, white {dr}%, #ddd 0%"> {date_content}</td>'
			
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
		events = Todo.objects.filter(date__year=self.year, date__month=self.month, home=self.home)

		cal = f'<table border="0" cellpadding="0" cellspacing="0" class="calendar">\n'
		cal += f'{self.formatweekheader()}\n'
		for week in self.monthdays2calendar(self.year, self.month):
			cal += f'{self.formatweek(week, events, self.year, self.month)}\n'
		return cal
