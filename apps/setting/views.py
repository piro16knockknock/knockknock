from django.shortcuts import render, redirect
from .forms import HomeForm, UtilityForm
from login.models import User
from .models import Utility, Invite, LiveIn
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


#룸메이트 취소
@csrf_exempt
def invite_cancel(request):
    req = json.loads(request.body)
    user_id = req['invite_cancel_id']
    recieve_user = User.objects.get(pk=user_id)
    Invite.objects.filter(receive_user=recieve_user, home=request.user.home).delete()
    return JsonResponse({'id': user_id })
    
#룸메이트 목록
def roommate_list(request):
    roommates = User.objects.filter(home=request.user.home)
    roommates = roommates.exclude(nick_name=request.user.nick_name)
    invites = Invite.objects.filter(home=request.user.home)
    
    invite_users = []
    for invite in invites:
        invite_users.append(User.objects.get(nick_name=invite.receive_user.nick_name))
            
    ctx = {
        'roommates' : roommates,
        'invite_users' : invite_users
    }
    return render(request, 'setting/roommate_list.html', context=ctx)

#집 등록
def myhome_register(request):
    if request.method == 'POST':        
        home_form = HomeForm(request.POST)
        utility_form = UtilityForm(request.POST)
        if home_form.is_valid() and utility_form.is_valid():
            print("post")
            current_home = home_form.save()
            request.user.home = current_home
            request.user.save()
            Utility.objects.create(home = current_home, name = request.POST.get("utility_name"), date = request.POST.get("utility_date"))
            
            #거주하기도 만들어야함
            LiveIn.objects.create(user = request.user, home = current_home)
            return redirect('setting:myhome_setting')
    else:
        print("get")
    return render(request, 'setting/myhome_form.html')

# 집 디테일. 여기서 업데이트
def myhome_detail(request):
    current_user = request.user
    current_home = current_user.home
    utilities = Utility.objects.filter(home=current_home) # 본인 포함
    current_roommates = User.objects.filter(home=current_home) # 본인 포함
    users = User.objects.exclude(home=current_home)
    
    #초대한 유저 거르기
    invites = Invite.objects.filter(home=request.user.home)    
    invite_users = []
    for invite in invites:
        invite_users.append(invite.receive_user.nick_name)
    for invite_user in invite_users:
        users = users.exclude(nick_name=invite_user)

    ctx = {
        'home_name' : current_home.name,
        'rent_date' : current_home.rent_date,
        'utilities' : utilities,
        'roommates' : current_roommates,
        'users' : users,
    }
    return render(request, 'setting/myhome_detail.html', context=ctx)

#초대하기
@csrf_exempt
def invite_roommate(request):
    req = json.loads(request.body)
    invite_list = req['invite_list']
    # 룸메이트 초대 db 저장
    for nickname in invite_list:
        user = User.objects.get(nick_name=nickname)
        Invite.objects.create(home=request.user.home, receive_user=user)
    
    return JsonResponse({'success':True})

# 집 목록
def myhome_setting(request):
    current_user = request.user
    current_home = current_user.home
    if(current_home == None):
        is_home = False
        ctx = {
            'is_home' : is_home,
        }
        return render(request, 'setting/myhome_setting.html', context=ctx)
    else:
        current_roommates = User.objects.filter(home=current_home) # 본인 포함
        is_home = True
        ctx = {
            'is_home' : is_home,
            'user_name' : current_user.nick_name,
            'home_name' : current_home.name,
            'roommates' : current_roommates,
        }
        return render(request, 'setting/myhome_setting.html', context=ctx)