# Generated by Django 4.0.2 on 2022-02-19 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_alter_title_emoji'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nick_name',
            field=models.CharField(max_length=10, null=True, unique=True),
        ),
    ]