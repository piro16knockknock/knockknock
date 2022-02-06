from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('todo-new/', views.add_todo, name='add_new'),
]
