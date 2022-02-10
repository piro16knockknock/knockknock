from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

## Entities
# 1.User
class User(AbstractUser):
    home = models.ForeignKey('setting.Home', on_delete=models.SET_NULL, blank=True, null=True)
    nick_name = models.CharField(max_length=10, unique=True, null=True, blank=True)
    profile_img = models.ImageField(null=True, blank=True)
    GENDER_CHOICES = (
        ('여성', '여성'),
        ('남성', '남성'),
        ('그외', '그외'),
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)

class Title(models.Model): #User's title
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name= 'title')
    title_num = models.IntegerField()
    content = models.CharField(max_length=20)
    emoji = models.ImageField()

class Notice(models.Model):
    receive_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name= 'notice')
    content = models.CharField(max_length=50)
    link = models.CharField(max_length = 200)
    create_at = models.DateTimeField(auto_now_add=True)