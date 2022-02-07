from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.intro, name='intro'),
    
    
    #이전집 기록 보기 만들려고 만든 임시 url. 나중에 삭제
    path('mypage/', views.mypage, name='mypage'),
]