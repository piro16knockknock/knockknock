from django import forms
from .models import User
from django.contrib.auth import get_user_model


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'nick_name', 'gender']