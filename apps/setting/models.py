from django.db import models
from login.models import User

# Create your models here.

## Entities
# 1.KnockKnock_Home
class Home(models.Model):
    name = models.CharField(max_length=20)
    rent_date = models.DateField(null=True) #전세면 이자 납부일?

class Utility(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name= 'utility')
    name = models.CharField(max_length=10)
    date = models.DateTimeField(auto_now_add=True)


## Relationships
class LiveIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    home = models.OneToOneField(Home, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now=True)
    end_date = models.DateField(null = True)

class Invite(models.Model):
    receive_user = models.OneToOneField(User, on_delete=models.CASCADE)
    home = models.OneToOneField(Home, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    invited_at = models.DateTimeField(auto_now=True)