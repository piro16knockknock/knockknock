from django.urls import path
from . import views


app_name = 'home'
urlpatterns = [
    path('', views.CalendarView.as_view(), name='calendar'),
    path('todo/<int:pk>/', views.home, name='todo'),
    path('todo/<int:pk>/new/', views.add_todo, name='add_todo'),
    path('todo/<int:pk>/edit/', views.add_todo, name='add_todo'),
]
