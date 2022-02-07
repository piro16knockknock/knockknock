from django.contrib import admin
from django.urls import path
from . import views

app_name = 'setting'

urlpatterns = [
    path('myhome/', views.myhome_setting, name='myhome_setting'),
    path('myhome/register', views.myhome_register, name='myhome_register'),
    #path('myhome/update', views.myhome_update, name='myhome_update'),
]