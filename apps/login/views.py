from multiprocessing import context
from django.shortcuts import render, redirect
from django.utils import timezone
from setting.models import LiveIn
from home.models import Todo

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
    
    Todo.objects.filter(home=current_home, user=current_user).delete()
    return redirect('login:mypage')

#나중에 합치면서 삭제.
def mypage(request):
    ctx = { 'prehomes' : prehome_list(request) }
    return render(request, 'login/mypage_temp.html', ctx)