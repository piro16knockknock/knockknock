# Generated by Django 4.0.2 on 2022-02-16 08:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_livingrule_create_at_livingrulecate_create_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='cate',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='todo', to='home.todocate'),
        ),
    ]