from xml.etree.ElementInclude import default_loader
from django.db import models
from django.forms import BooleanField
from login.models import User
from setting.models import Home
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.
# 1.Todo
class TodoCate(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name= 'todo_cate')
    name = models.CharField(max_length=10)

class TodoPriority(models.Model):
    content = models.CharField(max_length=10)
    priority_num = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(2)])

class Todo(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name= 'todo')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='todo')
    cate = models.ForeignKey(TodoCate, on_delete=models.SET_NULL, null=True, blank=True, related_name='todo')
    content = models.CharField(max_length=100)
    date = models.DateField()
    # TodoPriority 중 오늘 안에에 해당하는 중요도를 연결해주려면 id로 연결해야함!
    priority = models.ForeignKey(TodoPriority, on_delete=models.SET_DEFAULT, default=TodoPriority.objects.get(priority_num=2).pk, related_name='todo')
    #0 - 상관없음 1-조금 급함 2-당장 해줘
    is_postpone = models.BooleanField(default=False)
    is_done_date = models.DateTimeField(null=True, blank=True)
    is_done = models.BooleanField(default=False)

class TodoReaction(models.Model):
    todo = models.ForeignKey(Todo, on_delete=models.CASCADE, related_name='reaction')
    send_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reation')
    reaction_num = models.IntegerField()

# 2.LivingRule
class LivingRuleCate(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='living_rule_cate', null=True)
    name = models.CharField(max_length=20)
    
    def __str__(self):
        return "[" + self.home.name + "]" + self.name
    
class LivingRule(models.Model):
    cate = models.ForeignKey(LivingRuleCate, on_delete=models.CASCADE, related_name='living_rule')
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='living_rule')
    content = models.CharField(max_length=50)
    
    def __str__(self):
        return "[" + self.home.name + "]" + "[" + self.cate.name + "] " + self.content


# 3.Guideline
class Guideline(models.Model):
    home = models.OneToOneField(Home, on_delete=models.CASCADE, related_name='guideline')
    is_done = models.BooleanField(default=False)

class GuidelineQCate(models.Model):
    name = models.CharField(max_length=10)

class GuidelineQ(models.Model):
    cate = models.ForeignKey(GuidelineQCate, on_delete=models.CASCADE, related_name='qna')
    question = models.CharField(max_length=10)

class GuidelineA(models.Model):
    guideline = models.ForeignKey(Guideline, on_delete=models.CASCADE, related_name='question_cate')
    question = models.ForeignKey(GuidelineQ, on_delete=models.CASCADE, related_name = 'answer')
    content = models.CharField(max_length=200)
