from multiprocessing import context
from django.shortcuts import render, redirect
from django.utils import timezone
from datetime import datetime
from django.utils.dateformat import DateFormat
from home.models import Todo, LivingRule, LivingRuleCate
from django.shortcuts import get_object_or_404

#이전 집 기록 보기
from setting.models import LiveIn, Home
from home.models import Todo
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
        user_todos = Todo.objects.filter(user=request.user)[:2]
        print(user_todos)
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
def take_prelivingrule(request, pk):
    current_home = request.user.home
    target_home = get_object_or_404(Home, id=pk)
    target_living_rules = LivingRule.objects.filter(home=target_home)
    target_living_rules_cate = LivingRuleCate.objects.filter(home=target_home)
    
    for living_rule in target_living_rules:
        LivingRule.objects.get_or_create(home = current_home, cate = living_rule.cate, content= living_rule.content)
    
    for living_rule_cate in target_living_rules_cate:
        LivingRuleCate.objects.get_or_create(home = current_home, name = living_rule_cate.name)
    
    return redirect('login:mypage')

#이전집 기록 보기
def prehome_list(request):
    prehome_infos = LiveIn.objects.filter(user=request.user)
    prehome_infos = prehome_infos.filter(end_date__isnull=False)
    prehome_dict = {}
    for prehome_info in prehome_infos:
        prehome = prehome_info.home
        prehome_dict[prehome.name] = {}
        living_rules = LivingRule.objects.filter(home = prehome)
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
    return prehome_infos, prehome_dict

#이사하기
def leave_home(request):
    current_user = request.user
    #end_date 저장
    current_home = current_user.home
    LiveIn.objects.filter(home=current_home, user=current_user).update(end_date=timezone.now())
    #정보 초기화
    current_user.home = None
    current_user.save()
    
    Todo.objects.filter(home=current_home, user=current_user).update(user=None)    
        
    return redirect('login:mypage')

#나중에 합치면서 삭제.
def mypage(request):
    prehomes, prehome_dict = prehome_list(request)
    
    ctx = { 'prehomes' : prehomes, 'prehome_dict' : prehome_dict }
    return render(request, 'login/mypage_temp.html', ctx)