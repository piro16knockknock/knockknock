from multiprocessing import context
from django.shortcuts import render

# Create your views here.
def intro(request):
    ctx = {
        'username' : request.user.username
    }
    return render(request, 'login/intro.html', context= ctx)