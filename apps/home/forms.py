from django import forms
from .models import *

class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = ('content', 'user', 'cate', )

    def __init__(self, home, *args, **kwargs):
        super(TodoForm, self).__init__(*args, **kwargs)
        self.fields['user'].queryset = User.objects.filter(home = home)
        self.fields['cate'].queryset = TodoCate.objects.filter(home = home)

class LivingRuleForm(forms.ModelForm):
    class Meta:
        model = LivingRule
        fields = ('cate','content',)
 