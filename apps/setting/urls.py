from django.contrib import admin
from django.urls import path
from . import views

app_name = 'setting'

urlpatterns = [
    path('myhome/register/', views.myhome_register, name='myhome_register'),
    path('myhome/detail/', views.myhome_detail, name='myhome_detail'),
    
    path('myhome/search_home/', views.search_home, name='search_home'),
    path('myhome/knock_home/', views.knock_home, name='knock_home'),
    path('myhome/knock_cancel/', views.knock_cancel, name='knock_cancel'),
    
    path('myhome/check_homename/', views.check_homename, name='check_homename'),
    path('myhome/myhome_update/', views.myhome_update, name='myhome_update'),

    path('myhome/search_user/', views.search_user, name='search_user'),
    path('myhome/invite_roommate/', views.invite_roommate, name='invite_roommate'),
    path('myhome/accept_invite/', views.accept_invite, name='accept_invite'),
    
    path('roommate/list', views.roommate_list, name='roommate_list'),
    path('roommate/invite_cancel/', views.invite_cancel, name='invite_cancel'),
    
    #초대 링크
    path('myhome/detail/<int:pk>/<str:link>/', views.invite_link, name='invite_link')
]