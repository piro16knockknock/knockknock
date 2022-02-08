from django.contrib import admin
from django.urls import path
from . import views

app_name = 'setting'

urlpatterns = [
    path('myhome/register/', views.myhome_register, name='myhome_register'),
    path('myhome/detail/', views.myhome_detail, name='myhome_detail'),
    path('myhome/invite_roommate/', views.invite_roommate, name='invite_roommate'),

    path('myhome/myhome_update/', views.myhome_update, name='myhome_update'),
    path('myhome/accept_invite/', views.accept_invite, name='accept_invite'),
    
    path('roommate/list', views.roommate_list, name='roommate_list'),
    path('roommate/invite_cancel/', views.invite_cancel, name='invite_cancel'),
]