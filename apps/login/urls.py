from django.contrib import admin
from django.urls import path
from . import views

app_name = 'login'

urlpatterns = [
    path('', views.intro, name='intro'),
    
    #이사가기
    path('leave_home/', views.leave_home, name='leave_home'),
    #이전집 기록 보기 만들려고 만든 임시 url. 나중에 삭제
    path('mypage/', views.mypage, name='mypage'),
    path('signup/', views.sign_up, name='sign_up'),
    path('login/', views.login, name='login'),
    path('logout/', views.logoutUser, name='logout'),
]