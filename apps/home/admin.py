from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Todo)
admin.site.register(TodoCate)
admin.site.register(TodoPriority)
admin.site.register(TodoReaction)
admin.site.register(LivingRule)
admin.site.register(LivingRuleCate)
