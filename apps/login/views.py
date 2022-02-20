from django.contrib.auth.decorators import login_required
from multiprocessing import context
from django.shortcuts import render, redirect
from django.utils import timezone
from datetime import datetime
from django.utils.dateformat import DateFormat
from home.models import Todo, LivingRule, LivingRuleCate
from django.shortcuts import get_object_or_404
from django.contrib import messages
from multiprocessing import context
from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from django.contrib.auth import authenticate, login, logout
#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .forms import UserUpdateForm
from setting.models import Invite, Knock, LiveIn, Home, PreRoommates, Utility
from home.models import Todo
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
#template custom (dictionary)
from django.template.defaulttags import register

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

# Create your views here.
def intro(request):
    if request.user.is_authenticated :
        today = DateFormat(datetime.now()).format('Y-m-d')
        today_url = '/home/todo/' + str(today)
        user_todos = Todo.objects.filter(user=request.user, date = datetime.now(), is_done=False)[:3]
        ctx = {
            'username' : request.user.username,
            'today_date' : today,
            'today_date_url' : today_url,
            'user_todos' : user_todos,
        }
        return render(request, 'login/intro.html', context= ctx)
    else:
        return render(request, 'login/intro.html')

#이전집 생활수칙 가져오기
@csrf_exempt
@login_required
def take_prelivingrule(request):
    current_home = request.user.home
    req = json.loads(request.body)
    checked_list = req['checked_list']
    for checked in checked_list:
        category = checked['cate']
        content = checked['content']
        LivingRuleCate.objects.get_or_create(home = current_home, name = category)
        livingrule_cate = LivingRuleCate.objects.get(home=current_home, name=category)
        LivingRule.objects.get_or_create(home = current_home, cate = livingrule_cate, content= content)
        
    return redirect('login:mypage')

#이전집 기록 보기
@login_required
def prehome_list(request):
    prehome_infos = LiveIn.objects.filter(user=request.user)
    prehome_infos = prehome_infos.filter(end_date__isnull=False)
    
    preroommates_dict = {}
    prehome_dict = {}
    for prehome_info in prehome_infos:
        #생활수칙 보기 - (이전)룸메이트
        preroommates_dict[prehome_info.home.name] = PreRoommates.objects.filter(live_in = prehome_info)
        
        prehome = prehome_info.home
        prehome_dict[prehome.name] = {}
        living_rules = LivingRule.objects.filter(home = prehome, create_at__lt = prehome_info.end_date)
        for living_rule in living_rules:
            if living_rule.cate.name in prehome_dict[prehome.name] : # 이미 키가 있으면
                prehome_dict[prehome.name][living_rule.cate.name].append(living_rule.content)
            else: #없으면 생성
                prehome_dict[prehome.name][living_rule.cate.name] = [living_rule.content]
    
    '''
        ['집1'] : [
            ['생활 수칙 카테'] : '생활수칙1', '생활수칙2', '생활수칙3'...,
            ['생활 수칙 카테'] : '생활수칙1', '생활수칙2', '생활수칙3'...,
        ],
        ['집2'] :  [
            ['생활 수칙 카테'] : '생활수칙1', '생활수칙2', '생활수칙3'...,
            ['생활 수칙 카테'] : '생활수칙1', '생활수칙2', '생활수칙3'...,
        ],
    
    '''
    

    return prehome_infos, prehome_dict, preroommates_dict

#이사하기
@login_required
def leave_home(request):
    current_user = request.user
    #end_date 저장
    current_home = current_user.home
    LiveIn.objects.filter(home=current_home, user=current_user).update(end_date=timezone.now())
    #이사가기를 누른 순간의 룸메이트들 저장
    for roommates in User.objects.filter(home=current_home):
        PreRoommates.objects.get_or_create(live_in=get_object_or_404(LiveIn, home=current_home),
                                    user = roommates)
    
    #정보 초기화
    current_user.home = None
    current_user.save()
    
    Todo.objects.filter(home=current_home, user=current_user).update(user=None)    
        
    return redirect('login:mypage')

#mypage
@login_required
def mypage(request):
    prehomes, prehome_dict, preroommates_dict = prehome_list(request)

    current_user = request.user

    roommates = User.objects.filter(home=request.user.home)
    roommates = roommates.exclude(nick_name=request.user.nick_name)
    invites = Invite.objects.filter(home=request.user.home)
    
    invite_users = []
    for invite in invites:
        if invite.is_accepted is False:
            invite_users.append(User.objects.get(nick_name=invite.receive_user.nick_name))
            
    roommate_titles = {}

    my_titles = {}
    my_titles = Title.objects.filter(user=current_user)
    
    roommate_ratio = {}
    today = datetime.now()
    #전체 달성률
    today_string = f'{today.year}-{today.month}-{today.day}'
    total_todos = Todo.objects.filter(home = request.user.home, date = today_string)
    complete_total_todos = total_todos.filter(is_done=True)
    if total_todos.count() == 0:
        total_compelete_ratio = 0
    else:
        total_compelete_ratio = complete_total_todos.count() / total_todos.count()
        
    for roommate in roommates:
        roommate_titles[current_user.nick_name] = Title.objects.filter(user=current_user)
    
    

        #룸메이트 달성률
        user_todos = total_todos.filter(user=roommate)
        complete_user_todos = total_todos.filter(is_done = True, user=roommate)
        if user_todos.count() == 0:
            user_compelete_ratio = 0
        else:
            user_compelete_ratio = complete_user_todos.count() / user_todos.count()
            
        roommate_ratio[roommate.nick_name] = int(user_compelete_ratio * 100)
    
    
    ctx = {
        'roommates' : roommates,
        'invite_users' : invite_users,
        'roommate_titles' : roommate_titles,
        'roommate_ratio' : roommate_ratio,
        'user_complete_ratio' : int(user_compelete_ratio * 100),
        'total_complete_ratio' : int(total_compelete_ratio * 100),
        'prehomes' : prehomes,
        'prehome_dict' : prehome_dict,
        'preroommates_dict': preroommates_dict,
        'my_titles' : my_titles,
    }
    return render(request, 'login/mypage.html', context=ctx)


#회원가입 기능
def sign_up(request):
    if request.method == "POST":
        if request.POST["password"] == request.POST["password2"]:
            User = get_user_model()
            user = User.objects.create_user(
                username=request.POST.get("username"),
                password=request.POST.get("password"),
                email=request.POST.get("email"),
                nick_name=request.POST.get("nick_name"),
                gender=request.POST.get("gender"),
            )            
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('/')
        messages.warning(request, "비밀번호 두 개가 다릅니다.")
        return render(request, 'login/sign_up.html')
    return render(request, 'login/sign_up.html')

def login_user(request):
    if request.method == "GET":
        return render(request, 'login/login.html')

    elif request.method == "POST":
        
        user_id= request.POST.get('user_id')
        user_pw= request.POST.get('user_pw')

        user = authenticate(request, username=user_id, password=user_pw)

        if user is not None:
            login(request, user)
            return redirect('login:intro')
        else:
            messages.warning(request, "존재하지 않는 아이디입니다.")
            return redirect('login:login')

def logoutUser(request):
    logout(request)
    return redirect('login:intro')



def user_update(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('login:mypage')
    else:
        form = UserUpdateForm(instance=request.user)
    context = {
        'form': form
    }
    return render(request, 'login/user_update.html', context)

def profile_update(request):
    if request.method == 'POST':
        request.user.profile_img = request.FILES['represent']
        request.user.save()
        return redirect('login:mypage')
    else:
        form = UserUpdateForm(instance=request.user)
    context = {
        'form': form
    }
    return render(request, 'login/profile_update.html', context)

@method_decorator(csrf_exempt, name="dispatch")
def check_username(request):
    req = json.loads(request.body)
    username = req['user_name']
    if( User.objects.filter(username=username).exists() ):
        return JsonResponse({'is_available' : False, 'input_name': username })
    else:
        return JsonResponse({'is_available' : True, 'input_name': username })
    
@csrf_exempt
def check_email(request):
    req = json.loads(request.body)
    email = req['email']
    if( User.objects.filter(email=email).exists() ):
        return JsonResponse({'is_available' : False, 'input_email': email })
    else:
        return JsonResponse({'is_available' : True, 'input_email': email })
    
@csrf_exempt
def check_nick_name(request):
    req = json.loads(request.body)
    nick_name = req['nick_name']
    if( User.objects.filter(nick_name=nick_name).exists() ):
        return JsonResponse({'is_available' : False, 'input_nick_name': nick_name })
    else:
        return JsonResponse({'is_available' : True, 'input_nick_name': nick_name })