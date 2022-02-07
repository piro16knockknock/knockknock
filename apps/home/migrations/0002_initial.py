# Generated by Django 4.0.2 on 2022-02-06 05:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('home', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('setting', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='todoreaction',
            name='send_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reation', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='todoreaction',
            name='todo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reaction', to='home.todo'),
        ),
        migrations.AddField(
            model_name='todocate',
            name='home',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='todo_cate', to='setting.home'),
        ),
        migrations.AddField(
            model_name='todo',
            name='cate',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='todo', to='home.todocate'),
        ),
        migrations.AddField(
            model_name='todo',
            name='home',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='todo', to='setting.home'),
        ),
        migrations.AddField(
            model_name='todo',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='todo', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='livingrule',
            name='cate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='living_rule', to='home.livingrulecate'),
        ),
        migrations.AddField(
            model_name='livingrule',
            name='home',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='living_rule', to='setting.home'),
        ),
        migrations.AddField(
            model_name='guildelineq',
            name='cate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='qna', to='home.guidelineqcate'),
        ),
        migrations.AddField(
            model_name='guidelinga',
            name='guideline',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_cate', to='home.guideline'),
        ),
        migrations.AddField(
            model_name='guidelinga',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer', to='home.guildelineq'),
        ),
        migrations.AddField(
            model_name='guideline',
            name='home',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='guideline', to='setting.home'),
        ),
    ]