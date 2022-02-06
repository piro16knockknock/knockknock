from django.shortcuts import redirect, render
from .models import Todo


# Create your views here.
def home(request):
    if request.user.is_authenticated:
        current_user = request.user
        print(current_user.home.name)
        total_todos = Todo.objects.filter(home__name = current_user.home.name)
        print('total_todos : ', total_todos)
        user_todos = total_todos.filter(user__username = current_user.username)
        print('user_todos : ', user_todos)

        ctx = {
            'total_todos' : total_todos,
            'user_todos' : user_todos,
            'username' : current_user.username,
        }

        return render(request, 'home/home.html', context=ctx)

    else:
        redirect('intro')