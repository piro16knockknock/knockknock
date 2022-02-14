from django.shortcuts import render, redirect
from .forms import HomeForm, UtilityForm
from login.models import User, Notice
from home.models import TodoCate
from .models import Utility, Invite, LiveIn, Home
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
        if invite.is_accepted is False:
            invite_users.append(User.objects.get(nick_name=invite.receive_user.nick_name))
    ctx = {
        'roommates' : roommates,
        'invite_users' : invite_users
    }
    return render(request, 'setting/roommate_list.html', context=ctx)

#집 등록
@csrf_exempt
def check_homename(request):
    req = json.loads(request.body)
    home_name = req['home_name']
    if( Home.objects.filter(name=home_name).exists() ):
        return JsonResponse({'is_available' : False, 'input_name': home_name })
    else:
        return JsonResponse({'is_available' : True, 'input_name': home_name })

def myhome_register(request):
    if request.method == 'POST':
        home_form = HomeForm(request.POST)
        utility_form = UtilityForm(request.POST)
        if home_form.is_valid() and utility_form.is_valid():
            print("post")
            current_home = Home()
            current_home.name = home_form.cleaned_data['name']
            
            if(request.POST.get('utility_or_rent') == "월세"):
                print("here")
                current_home.is_rent = True
                current_home.rent_month = home_form.cleaned_data['rent_month']
                current_home.rent_date = home_form.cleaned_data['rent_date']
        
            else:
                current_home.is_rent = False
                current_home.rent_month = 1
                current_home.rent_date = 1
            
            current_home.save()
            request.user.home = current_home
            request.user.save()
            
            #공과금
            utility_name_list = request.POST.getlist('utility_name')
            utility_month_list = request.POST.getlist('utility_month')
            utility_date_list = request.POST.getlist('utility_date')
            for i in range(len(utility_name_list)):
                Utility.objects.create(home = current_home, 
                                    name = utility_name_list[i], 
                                    month = utility_month_list[i],
                                    date = utility_date_list[i])
            
            LiveIn.objects.create(user = request.user, home = current_home)
            TodoCate.objects.create(home = current_home, name="빨래")
            TodoCate.objects.create(home = current_home, name="청소")
            return redirect('setting:myhome_detail')
    else:
        print("get")
    return render(request, 'setting/myhome_form.html')

# 집 디테일
def myhome_detail(request):
    current_user = request.user
    current_home = current_user.home
    utilities = Utility.objects.filter(home=current_home) # 본인 포함
    current_roommates = User.objects.filter(home=current_home) # 본인 포함
    ctx = {
        'home_name' : current_home.name,
        'is_rent' : current_home.is_rent,
        'rent_date' : current_home.rent_date,
        'rent_month' : current_home.rent_month,
        'utilities' : utilities,
        'roommates' : current_roommates,
    }
    return render(request, 'setting/myhome_detail.html', context=ctx)

#집 업데이트
@csrf_exempt
def myhome_update(request):
    req = json.loads(request.body)
    home_name = req['home_name']
    is_rent = req['is_rent']
    rent_month = req['rent_month']
    rent_date = req['rent_date']
    utility_name_list = req['utility_name']
    utility_month_list = req['utility_month']
    utility_date_list = req['utility_date']
    
    current_home = Home.objects.filter(name=request.user.home.name)
    if(is_rent):
        current_home.update(name=home_name, rent_month=rent_month, rent_date=rent_date, is_rent=is_rent)
    else:
        current_home.update(name=home_name, rent_month=1, rent_date=1, is_rent=is_rent) # 1개월마다 1일을 default값으로.

    #공과금
    #업데이트가 복잡하므로 어차피 몇 안되는거 그냥 다 삭제하고 생성    
    Utility.objects.filter(home=request.user.home).delete()
    for i in range(len(utility_month_list)):
        Utility.objects.create(home=request.user.home, name=utility_name_list[i], month=utility_month_list[i], date=utility_date_list[i])
        
    return JsonResponse({ 'home_name' : home_name })

#초대하기
@csrf_exempt
def invite_roommate(request):
    req = json.loads(request.body)
    invite_list = req['invite_list']
    # 룸메이트 초대 db 저장
    for nickname in invite_list:
        user = User.objects.get(nick_name=nickname)
        Invite.objects.create(home=request.user.home, receive_user=user)
        #알림에 저장
        Notice.objects.create(receive_user=user, content="룸메이트 초대")
        
        
    return JsonResponse({'success':True})

#초대 검색
@csrf_exempt
def search_user(request):
    req = json.loads(request.body)
    search_word = req['search_word']
    
    #검색 단어 필터링 전, 1. 집이 있는 유저 2. 초대한 룸메를 제외시킨다.
    users = User.objects.exclude(home__isnull=False)
    invites = Invite.objects.filter(home=request.user.home)    
    invite_users = []
    for invite in invites:
        invite_users.append(invite.receive_user.nick_name)
    for invite_user in invite_users:
        users = users.exclude(username=invite_user) # nick_name이 아닌 username.
    
    #db에서 search_word와 일치하는 탑4 유저 검색
    users = users.filter(username__startswith=search_word)[:4]
    search_list = []
    for user in users : # 검색은 아이디, 출력은 닉네임
        if user.profile_img :
            search_list.append({'nickname' : user.nick_name, 'profile' : user.profile_img.url})
        else:
            search_list.append({'nickname' : user.nick_name, 'profile' : ''})
    
    return JsonResponse( { "user_list" : search_list } )

#초대 수락하기
def accept_invite(request):
    user = request.user
    user.invite.is_accepted = True
    user.invite.save()

    live_in = LiveIn.objects.create(user=user, home=user.invite.home)
    live_in.save()
    
    user.home = user.invite.home
    user.save()
    return redirect('login:intro')
