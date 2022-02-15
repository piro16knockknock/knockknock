import json
from select import select
from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.safestring import mark_safe
from django.views import generic

from .models import Todo, Home, TodoCate, TodoPriority
from login.models import User
# from .forms import TodoForm
from .models import Todo, Home, LivingRuleCate, LivingRule
from .forms import LivingRuleForm
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
        context['month'] = str(d.month)
        context['year'] = str(d.year)
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

# add_todo_ajax
@csrf_exempt
@login_required
def add_todo(request, date):
    req = json.loads(request.body)
    data = req['form_data']
    print(data)
    content = data['content']
    priority = data['priority']
    cate = data['cate']
    user = data['user']

    # 내 할 일 페이지에서 기타 카테고리가 아닌 카테고리
    if cate != 'no-cate' and user != 'no-user':
        print("내꺼 기타말고")
        todo = Todo.objects.create(home=request.user.home, content=content, cate=TodoCate.objects.get(id = cate), user = User.objects.get(id = user), 
        priority = TodoPriority.objects.get(id = priority), date = date)
        res = JsonResponse({
        'todo_id' : todo.id,
        'todo_content' : todo.content,
        'todo_priority_content' : todo.priority.content,
        'todo_priority_num' : todo.priority.priority_num,
        'cate_id' : cate,
        'cate_name' : TodoCate.objects.get(id=cate).name,
        'user_name' : User.objects.get(id = user).username,
        })

    # 내 할 일 페이지에서 기타 카테고리
    elif cate == 'no-cate' and user != 'no-user':
        print("내꺼 기타")
        todo = Todo.objects.create(home=request.user.home, content=content, user = User.objects.get(id = user), 
        priority = TodoPriority.objects.get(id = priority), date = date)
        res = JsonResponse({
        'todo_id' : todo.id,
        'todo_content' : todo.content,
        'todo_priority_content' : todo.priority.content,
        'todo_priority_num' : todo.priority.priority_num,
        'cate_id' : 'no-cate',
        'cate_name' : 'no-cate',
        'user_name' : User.objects.get(id = user).username,
        })

    # 전체 할 일 페이지에서 담당없음 카테고리
    else:
        print("전체")
        todo = Todo.objects.create(home=request.user.home, content=content,
        priority = TodoPriority.objects.get(id = priority), date = date)
        res = JsonResponse({
        'todo_id' : todo.id,
        'todo_content' : todo.content,
        'todo_priority_content' : todo.priority.content,
        'todo_priority_num' : todo.priority.priority_num,
        'cate_id' : 'no-cate',
        'cate_name' : 'no-cate',
        'user_name' : 'no-user',
        })
    
    return res

@csrf_exempt
@login_required
def delete_todo(request, date, todo_id):
    delete_todo = Todo.objects.get(id = todo_id)
    delete_todo.delete()
    return JsonResponse({
        'todo_id' : todo_id,
    })

@csrf_exempt
@login_required
def make_edit_form(request, date, todo_id):
    todo = Todo.objects.get(id=todo_id)
    content = todo.content
    if todo.cate is None:
        cate_id = 'no-cate'
    else:
        cate_id = todo.cate.id
    if todo.user is None:
        user_id = 'no-user'
    else:
        user_id= todo.user.id

    priority_id = todo.priority.id
    return JsonResponse({
        'content' : content,
        'cate_id' : cate_id,
        'user_id' : user_id,
        'priority_id' : priority_id,
    })

@csrf_exempt
@login_required
def edit_todo(request, date, todo_id):
    todo = Todo.objects.get(id=todo_id)
    req = json.loads(request.body)['form_data']

    todo.content = req['content']
    todo.priority = TodoPriority.objects.get(id=int(req['priority']))
    todo.cate = TodoCate.objects.get(id = req['cate'])
    print(todo)
    todo.save()

    return JsonResponse({
        'todo_id' : todo.id,
        'content' : todo.content,
        'priority_num' : todo.priority.priority_num,
    })


@login_required
def postpone_todo(request, date, todo_id):
    todo = Todo.objects.get(id = todo_id)
    todo.is_postpone = True
    nextdate = datetime.strptime(date, "%Y-%m-%d")
    nextdate = nextdate + timedelta(days=1)
    
    todo.date = nextdate
    todo.save()

    return redirect('home:date_todo', date=date)

@login_required
def date_todo(request, date):
    current_user = request.user
    total_todos = Todo.objects.filter(home__name = current_user.home.name, date = date)
    complete_total_todos = total_todos.filter(is_done=True)
    user_todos = total_todos.filter(user__username = current_user.username, date = date, is_done=False)
    complete_user_todos = total_todos.filter(user__username = current_user.username, date = date, is_done=True)
 
    current_home = Home.objects.filter(user = current_user)[0]
    roommates = User.objects.filter(home=request.user.home)
    cates = TodoCate.objects.filter(home = current_home)

    user_todo_dict = make_todo_with_cate_dict(user_todos, cates)
    total_todo_dict = make_todo_with_cate_dict(total_todos, cates)
    no_user_todos = total_todos.filter(user=None)
    no_cate_user_todos = user_todos.filter(cate=None)
    doing_todos = total_todos.exclude(user=None).exclude(is_done=True)
    todo_priority = TodoPriority.objects.all()

    today = datetime.now()
    today_string = f'{today.year}-{today.month}-{today.day}'

    ctx = {
        'today' : today_string,
        'select_date' : date,
        'total_todo_dict' : total_todo_dict,
        'user_todo_dict' : user_todo_dict,
        'complete_user_todos' : complete_user_todos,
        'complete_total_todos' : complete_total_todos,
        'no_user_todos' : no_user_todos,
        'no_cate_user_todos' : no_cate_user_todos,
        'doing_todos' : doing_todos,
        'username' : current_user.username,
        # 'form' : form,
        'cates' : cates,
        'todo_priority' : todo_priority,
        'roomates' : roommates
    }

    return render(request, 'home/date_todo/date_todo.html', context=ctx)

def prev_date_todo(request, date):
    current_user = request.user
    total_todos = Todo.objects.filter(home__name = current_user.home.name, date = date)
    complete_total_todos = total_todos.filter(is_done=True)
    complete_user_todos = total_todos.filter(user__username = current_user.username, date = date, is_done=True)
 
    roommates = User.objects.filter(home=request.user.home)

    ctx = {
        'select_date' : date,
        'complete_user_todos' : complete_user_todos,
        'complete_total_todos' : complete_total_todos,
        'username' : current_user.username,
        # 'form' : form,
        'roomates' : roommates
    }

    return render(request, 'home/date_todo/prev_date_todo.html', context=ctx)


def make_todo_with_cate_dict(todos, cates):
    todo_dict= {}
    for cate in cates:
        todo_dict[cate] = todos.filter(cate=cate)
    return todo_dict


# 생활수칙관련
def living_rules(request):
    cates = LivingRuleCate.objects.all()
    order_rules = {}
    for c in cates:
        rules = LivingRule.objects.filter(cate=c)
        order_rules[c] = rules
    ctx = {
        'order_rules': order_rules,
    }
    return render(request, 'home/living_rules.html', context=ctx)



def living_rule_new(request):
    if request.method == "POST":
        form = LivingRuleForm(request.POST)
        if form.is_valid():
            print("here")
            rule = form.save()
            rule.home = request.user.home
            rule.save()
            return redirect('home:living_rules')
    else:
        form = LivingRuleForm()
    ctx = {
        'form': form,
    }
    return render(request, 'home/living_rules_form.html', context=ctx)
    
    
    # context = {}
    # form = LivingRuleForm(request.POST)
 
    # if form.is_valid():
    #     LivingRule.objects.create(**form.cleaned_data)
        
    #     return redirect('home:living_rules')

    # context["form"] = form
    # return render(request, 'home/living_rules.html', context)


def living_rule_edit(request, pk):
    rule = get_object_or_404(LivingRule, pk=pk)
    if request.method == "POST":
        form = LivingRuleForm(request.POST, instance=rule)
        if form.is_valid():
            rule = form.save()
            cate = rule.cate
            return redirect('home:living_rules')
    else:
        form = LivingRuleForm(instance=rule)
    ctx = {
        'form': form
    }
    return render(request, 'home/living_rules_form.html', context=ctx)


def living_rule_delete(request, pk):
    rule = get_object_or_404(LivingRule, pk=pk)
    rule.delete()
    return (redirect('home:living_rules'))


def guideline(request):
    return render(request, 'home/guideline.html')