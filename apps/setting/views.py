from django.shortcuts import render, redirect
from .forms import HomeForm, UtilityForm
from login.models import User
from .models import Utility

# Create your views here.
def myhome_register(request):
    print(request)
    if request.method == 'POST':        
        home_form = HomeForm(request.POST)
        utility_form = UtilityForm(request.POST)
        if home_form.is_valid() and utility_form.is_valid():
            print("post")
            current_home = home_form.save()
            request.user.home = current_home
            request.user.save()
            Utility.objects.create(home = current_home, name = request.POST.get("utility_name"), date = request.POST.get("utility_date"))
            return redirect('setting:myhome_setting')
    else:
        print("get")
    return render(request, 'setting/myhome_form.html')
    
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