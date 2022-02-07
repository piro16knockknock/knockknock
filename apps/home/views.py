from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
from django.views import generic

from .models import Todo, Home
from .forms import TodoForm
from .utils import Calendar
from datetime import datetime, timedelta, date
import calendar


# Create your views here.
class CalendarView(generic.ListView):
    model = Todo
    template_name = 'home/calendar.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        d = get_date(self.request.GET.get('month', None))
        cal = Calendar(d.year, d.month)
        html_cal = cal.formatmonth(withyear=True)
        context['calendar'] = mark_safe(html_cal)
        context['prev_month'] = prev_month(d)
        context['next_month'] = next_month(d)
        print(context['prev_month'])
        return context

def get_date(req_month):
    if req_month:
        year, month = (int(x) for x in req_month.split('-'))
        return date(year, month, day=1)
    return datetime.today()

def prev_month(d):
    first = d.replace(day=1)
    prev_month = first - timedelta(days=1)
    month = 'month=' + str(prev_month.year) + '-' + str(prev_month.month)
    return month

def next_month(d):
    days_in_month = calendar.monthrange(d.year, d.month)[1]
    last = d.replace(day=days_in_month)
    next_month = last + timedelta(days=1)
    month = 'month=' + str(next_month.year) + '-' + str(next_month.month)
    return month


@login_required
def add_todo(request):
    current_user = request.user
    current_home = Home.objects.filter(user = current_user)[0]
    form = TodoForm(current_home, request.POST)
    print(form.errors)
    if form.is_valid():
        print("valid")
        todo = form.save(commit=False)
        print('but not save?')
        todo.home = current_home
        todo.save()
        return


@login_required
def home(request):
    if request.method == "POST":
        add_todo(request)
        return redirect('todo')
    else:
        current_user = request.user
        print(current_user.home.name)
        total_todos = Todo.objects.filter(home__name = current_user.home.name)
        print('total_todos : ', total_todos)
        user_todos = total_todos.filter(user__username = current_user.username)
        print('user_todos : ', user_todos)
        current_home = Home.objects.filter(user = current_user)
        print(current_home)
        form = TodoForm(current_home[0])

        ctx = {
            'total_todos' : total_todos,
            'user_todos' : user_todos,
            'username' : current_user.username,
            'form' : form,
        }

        return render(request, 'home/home.html', context=ctx)