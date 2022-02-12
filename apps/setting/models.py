from django.db import models
from login.models import User

# Create your models here.

## Entities
# 1.KnockKnock_Home
class Home(models.Model):
    name = models.CharField(max_length=20, unique=True)
    rent_date = models.IntegerField(default=1, null=True, blank=True)
    rent_month = models.IntegerField(default=1, null=True, blank=True)
    is_rent = models.BooleanField(default=False, null=True, blank=True)
    
    def __str__(self):
        return self.name

class Utility(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name= 'utility', blank=True)
    name = models.CharField(max_length=10, null=True, blank=True)
    month = models.IntegerField(null=True, blank=True)
    date = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

## Relationships
class LiveIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    home = models.ForeignKey(Home, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now=True)
    end_date = models.DateField(null = True, blank=True)
    
    def __str__(self):
        return self.user.nick_name + "가 " + self.home.name + "에 살았던 기록"

class Invite(models.Model):
    receive_user = models.OneToOneField(User, on_delete=models.CASCADE)
    home = models.ForeignKey(Home, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    invited_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return "(user)" + self.receive_user.nick_name + "에게 (home)" + self.home.name + "으로부터 온 초대"