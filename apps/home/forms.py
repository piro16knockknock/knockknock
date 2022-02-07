from django import forms
from .models import *

class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        widgets = {
            'date': forms.DateInput(attrs={'type': 'datetime-local'}, format='%Y/%m/%d'),
        }
        fields = ('content', 'user', 'cate', 'date', )

    def __init__(self, home, *args, **kwargs):
        super(TodoForm, self).__init__(*args, **kwargs)
        self.fields['user'].queryset = User.objects.filter(home = home)
        self.fields['cate'].queryset = TodoCate.objects.filter(home = home)
        self.fields['date'].input_formats = ('%Y/m/%d',)