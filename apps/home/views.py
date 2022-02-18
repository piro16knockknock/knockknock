import json
from locale import currency
from select import select
from time import sleep
from turtle import Turtle
from urllib import request
from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.safestring import mark_safe
from django.views import generic
from setting.models import *
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
        context['utility_list'] = close_utility(self.request)
        return context

#공과금
def close_utility(request):
    current_home = request.user.home
    utility_list = Utility.objects.filter(home=current_home)
    today = int(datetime.now().strftime("%d"))
    utility_list = sorted(utility_list, key=lambda x: x.date)
    
    for i in range(len(utility_list)):
        if utility_list[0].date >= today:
            break
        else:
            utility_list.append(utility_list[0])
            del utility_list[0]
    return utility_list[:3]


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
def date_todo(request, date):
    current_user = request.user
    total_todos = Todo.objects.filter(home__name = current_user.home.name, date = date)
    complete_total_todos = total_todos.filter(is_done=True)
    user_todos = total_todos.filter(user__username = current_user.username, date = date, is_done=False)
    complete_user_todos = total_todos.filter(user__username = current_user.username, date = date, is_done=True).order_by('-is_done_date')
 
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
        'roomates' : roommates,
        'utility_list' : close_utility(request)
    }

    return render(request, 'home/date_todo/date_todo.html', context=ctx)


def prev_date_todo(request, date):
    current_user = request.user
    total_todos = Todo.objects.filter(home__name = current_user.home.name, date = date)
    complete_total_todos = total_todos.filter(is_done=True)
    no_complete_todos = total_todos.filter(is_done = False)

    user_todos = total_todos.filter(user=current_user)
    no_complete_user_todos = total_todos.filter(is_done = False, user=current_user)
 
    roommates = User.objects.filter(home=request.user.home)

    today = datetime.now()
    today_string = f'{today.year}-{today.month}-{today.day}'

    if user_todos.count() is 0:
        user_compelete_ratio = 0
    else:
        user_compelete_ratio = no_complete_user_todos.count() / user_todos.count()

    if total_todos.count() is 0:
        total_compelete_ratio = 0
    else:
        total_compelete_ratio = no_complete_todos.count() / total_todos.count()

    print(user_compelete_ratio)
    print(total_compelete_ratio)
    ctx = {
        'today' : today_string,
        'select_date' : date,
        'no_complete_todos' : no_complete_todos,
        'complete_todo_dict' : make_todo_with_user_dict(complete_total_todos, roommates),
        'username' : current_user.username,
        'user_complete_ratio' : int(user_compelete_ratio * 100),
        'total_complete_ratio' : int(total_compelete_ratio * 100),
        'roomates' : roommates,
        'utility_list' : close_utility(request)
    }

    return render(request, 'home/date_todo/prev_date_todo.html', context=ctx)



def make_todo_with_cate_dict(todos, cates):
    todo_dict= {}
    for cate in cates:
        todo_dict[cate] = todos.filter(cate=cate)
    return todo_dict


def make_todo_with_user_dict(todos, users):
    todo_dict = {}
    for user in users:
        todo_dict[user] = todos.filter(user = user)
    return todo_dict

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
            'select_date' : date,
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
        'cate_name' : '기타',
        'user_name' : User.objects.get(id = user).username,
        'select_date' : date,
        })

    # 전체 할 일 페이지에서 담당없음 카테고리
    else:
        print("전체")
        todo = Todo.objects.create(home=request.user.home, content=content, cate=TodoCate.objects.get(id = cate),
        priority = TodoPriority.objects.get(id = priority), date = date)
        res = JsonResponse({
        'todo_id' : todo.id,
        'todo_content' : todo.content,
        'todo_priority_content' : todo.priority.content,
        'todo_priority_num' : todo.priority.priority_num,
        'cate_id' : cate,
        'cate_name' : todo.cate.name,
        'user_name' : 'no-user',
        'select_date' : date,
        })
    
    return res

@csrf_exempt
@login_required
def delete_todo(request, date, todo_id):
    delete_todo = get_object_or_404(Todo, id = todo_id)
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
    req = json.loads(request.body)
    todo = Todo.objects.get(id=req['todo_id'])
    if todo.user is None :
        current_user_id = 'no-user'
        current_user = None
    else:
        current_user_id = todo.user.id;
        current_user = get_object_or_404(User, id = current_user_id)
    if todo.cate is None:
        current_cate_id = 'no-cate'
    else:
        current_cate_id = todo.cate.id

    req = req['form_data']

    todo.content = req['content']
    todo.priority = TodoPriority.objects.get(id=int(req['priority']))

    if req['cate'] == 'no-cate':
        todo.cate = None
        cate_name = '기타'
    else:
        todo.cate = TodoCate.objects.get(id = req['cate'])
        cate_name = todo.cate.name
    
    if req['user'] == 'no-user':
        todo.user = None
        profile_img_url = None
    else:
        todo.user = User.objects.get(id = req['user'])
        profile_img_url = todo.user.profile_img.url
    todo.save()

    return JsonResponse({
        'current_user_id' : current_user_id,
        'current_cate_id' : current_cate_id,
        'user_id' : req['user'],
        'user_profile_url' : profile_img_url,
        'todo_id' : todo.id,
        'cate_id' : req['cate'],
        'cate_name' : cate_name,
        'content' : todo.content,
        'priority_num' : todo.priority.priority_num,
        'priority_content' : todo.priority.content,
    })

@csrf_exempt
@login_required
def done_todo(request, date, todo_id):
    req = json.loads(request.body)
    todo = get_object_or_404(Todo, id = req['todo_id'])
    todo.is_done = True
    todo.is_done_date = datetime.now()
    print(todo.is_done_date)
    todo.save()

    return JsonResponse({
        'todo_id' : todo.id,
        'todo_content' : todo.content,
        'todo_is_done_date' : todo.is_done_date,
        'todo_is_postpne' : todo.is_postpone,
    })

@csrf_exempt
@login_required
def postpone_todo(request, date, todo_id):
    todo = Todo.objects.get(id = todo_id)
    todo.is_postpone = True
    nextdate = datetime.strptime(date, "%Y-%m-%d")
    nextdate = nextdate + timedelta(days=1)
    
    todo.date = nextdate
    todo.save()

    return redirect('home:date_todo', date=date)

@csrf_exempt
@login_required
def add_user(request, date, todo_id):
    req = json.loads(request.body)
    todo = get_object_or_404(Todo, id = int(req['todo_id']))
    todo.user = get_object_or_404(User, id =int(req['form_data']['user']))
    todo.save()

    if todo.user.profile_img is None:
        user_profile_url = "https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=301&q=80"
    else:
        user_profile_url = todo.user.profile_img.url
        
    return JsonResponse({
        'current_user_id' : request.user.id,
        'todo_id' : todo.id,
        'user_profile_url' : user_profile_url,
        'user_id' : todo.user.id,
    })




# 카테고리 추가 관련
@csrf_exempt
@login_required
def check_catename(request):
    req = json.loads(request.body)
    new_catename = req['new_catename']
    current_home = get_object_or_404(Home, user=request.user)
    exist_cates = TodoCate.objects.filter(home=current_home)
    for cate in exist_cates:
        if new_catename == cate.name or new_catename == '기타':
            return JsonResponse({
                'exist_catename' : True
            })
    return JsonResponse({
        'exist_catename' : False
    })

@csrf_exempt
@login_required
def add_cate(request):
    req = json.loads(request.body)
    new_catename = req['new_catename']
    select_date = req['select_date']
    TodoCate.objects.create(home=request.user.home, name = new_catename)
    return redirect('home:date_todo', date=select_date)


# 카테고리 삭제 관련
@csrf_exempt
@login_required
def delete_cate(request):
    req = json.loads(request.body)
    cate_id = req['cate_id']

    cate = get_object_or_404(TodoCate, id = int(cate_id))
    cate.delete()
    return JsonResponse({

    })



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
    


def living_rule_edit(request, pk):
    print('edit')
    
    rule = get_object_or_404(LivingRule, pk=pk)
    if request.method == "POST":
        form = LivingRuleForm(request.POST, instance=rule)
        if form.is_valid():
            print(form)
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
    print('delete')
    rule = get_object_or_404(LivingRule, pk=pk)
    rule.delete()
    return (redirect('home:living_rules'))


def guideline(request):
    if request.method == "POST":
        # print(request.POST)
        # print(request.POST.get('silenttime'))

        LivingRule.objects.filter( home = request.user.home, is_guideline=True).delete()

        # 1. 최대한 조용히 해야 하는 시간
        silenttime = request.POST.get('silenttime')
        silenttime_answer = silenttime + ' 최대한 조용히 해야함'
        LivingRuleCate.objects.get_or_create(name = '생활패턴', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="생활패턴")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = silenttime_answer, is_guideline=True)

        # 2. 전화와 알람에 대해서는 항상 서로 미리 말해주기
        alarm = request.POST.get('alarm')
        alarm_answer = '전화와 알람에 대해서는 항상 서로 미리 말해주기 '+alarm
        LivingRuleCate.objects.get_or_create(name = '생활패턴', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="생활패턴")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = alarm_answer, is_guideline=True)

        # 3. 룸메와 활발한 친목하기
        friendship = request.POST.get('friendship')
        friendship_answer = '전화와 알람에 대해서는 항상 서로 미리 말해주기 '+friendship
        LivingRuleCate.objects.get_or_create(name = '생활패턴', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="생활패턴")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = friendship_answer, is_guideline=True)
       
        # 4. 공과금 및 월세 지출 방식
        expense = request.POST.get('expense')
        expense_answer = '공과금 및 월세 지출은 '+expense
        LivingRuleCate.objects.get_or_create(name = '돈', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="돈")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = expense_answer, is_guideline=True)

        # 5. 공유 품목
        share = {}
        share = request.POST.getlist('share[]')
        share_answer = '공유 품목 '+ "  ".join(share)

        LivingRuleCate.objects.get_or_create(name = '생필품', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="생필품")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = share_answer, is_guideline=True)

        # 6. 다른 사람 초대가 가능한지
        invite = request.POST.get('invite')
        invite_answer = '전화와 알람에 대해서는 항상 서로 미리 말해주기 '+invite
        LivingRuleCate.objects.get_or_create(name = '다른 사람 초대', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="다른 사람 초대")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = invite_answer, is_guideline=True)

        # 7. 다른 사람 숙박이 가능한지
        sleep = request.POST.get('sleep')
        sleep_answer = '전화와 알람에 대해서는 항상 서로 미리 말해주기 '+sleep
        LivingRuleCate.objects.get_or_create(name = '다른 사람 초대', home = request.user.home)
        living_pattern = LivingRuleCate.objects.get(home = request.user.home, name="다른 사람 초대")
        LivingRule.objects.get_or_create(cate = living_pattern, home = request.user.home, content = sleep_answer, is_guideline=True)


        return redirect('home:living_rules')


    return render(request, 'home/guideline.html')

