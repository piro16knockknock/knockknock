from django.urls import path
from . import views

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('todo/', views.home, name='todo'),
    path('todo-new/', views.add_todo, name='add_todo'),
]
