from django.shortcuts import render
from login.models import User

# Create your views here.
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