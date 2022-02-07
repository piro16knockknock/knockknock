from django import forms
from .models import Home, Utility

class HomeForm(forms.ModelForm):
    class Meta:
        model = Home
        fields = '__all__'
        
class UtilityForm(forms.ModelForm):
    class Meta:
        model = Utility
        fields = '__all__'