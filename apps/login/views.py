from multiprocessing import context
from django.shortcuts import render, redirect
from django.utils import timezone
from multiprocessing import context
from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from django.contrib.auth import authenticate, login, logout
#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

#이전 집 기록 보기
from setting.models import LiveIn

# Create your views here.
def intro(request):
    ctx = {
        'username' : request.user.username
    }
    return render(request, 'login/intro.html', context= ctx)

#이전집 기록 보기
def prehome_list(request):
    prehome_info = LiveIn.objects.filter(user=request.user)
    prehome_info = prehome_info.filter(end_date__isnull=False)
    return prehome_info

#이사하기
def leave_home(request):
    current_user = request.user
    #end_date 저장
    current_home = current_user.home
    LiveIn.objects.filter(home=current_home, user=current_user).update(end_date=timezone.now())
    #정보 초기화
    current_user.home = None
    current_user.save()
    #아 할일 모델이 아직 없네
    # ToDo.objects.filter(user=current_user).delete()
    return redirect('login:mypage')

#나중에 합치면서 삭제.
def mypage(request):
    ctx = { 'prehomes' : prehome_list(request) }
    return render(request, 'login/mypage.html', ctx)

#로그인 기능
def sign_up(request):
    if request.method == "POST":
        if request.POST["password"] == request.POST["password2"]:
            User = get_user_model()
            user = User.objects.create_user(
                username=request.POST.get("username"),
                password=request.POST.get("password"),
            )            
            login(request, user)

            return redirect('/')
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
            print("123")
            return redirect('login:mypage')

def logoutUser(request):
    logout(request)
    return redirect('login:intro')

