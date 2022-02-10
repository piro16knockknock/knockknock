# Generated by Django 4.0.2 on 2022-02-10 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('여성', '여성'), ('남성', '남성'), ('그외', '그외')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='nick_name',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]
