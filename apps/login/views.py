from multiprocessing import context
from django.shortcuts import render

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
    return prehome_info

#나중에 합치면서 삭제.
def mypage(request):
    ctx = { 'prehomes' : prehome_list(request) }
    return render(request, 'login/mypage_temp.html', ctx)