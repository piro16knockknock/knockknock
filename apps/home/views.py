from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from .models import Todo, Home
from .forms import TodoForm

# Create your views here.
@login_required
def calendar(request):
    current_user = request.user
    print(current_user.home.name)
    total_todos = Todo.objects.filter(home__name = current_user.home.name)
    print('total_todos : ', total_todos)
    user_todos = total_todos.filter(user__username = current_user.username)
    print('user_todos : ', user_todos)
    current_home = Home.objects.filter(user = current_user)
    print(current_home)
    form = TodoForm(current_home[0])

    ctx = {
        'total_todos' : total_todos,
        'user_todos' : user_todos,
        'username' : current_user.username,
        'form' : form,
    }
    return render(request, 'home/calendar.html', context = ctx)


@login_required
def add_todo(request):
    current_user = request.user
    current_home = Home.objects.filter(user = current_user)[0]
    form = TodoForm(current_home, request.POST)
    print(form.errors)
    if form.is_valid():
        print("valid")
        todo = form.save(commit=False)
        print('but not save?')
        todo.home = current_home
        todo.save()
        return


@login_required
def home(request):
    if request.method == "POST":
        add_todo(request)
        return redirect('todo')
    else:
        current_user = request.user
        print(current_user.home.name)
        total_todos = Todo.objects.filter(home__name = current_user.home.name)
        print('total_todos : ', total_todos)
        user_todos = total_todos.filter(user__username = current_user.username)
        print('user_todos : ', user_todos)
        current_home = Home.objects.filter(user = current_user)
        print(current_home)
        form = TodoForm(current_home[0])

        ctx = {
            'total_todos' : total_todos,
            'user_todos' : user_todos,
            'username' : current_user.username,
            'form' : form,
        }

        return render(request, 'home/home.html', context=ctx)