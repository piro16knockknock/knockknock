# Generated by Django 4.0.2 on 2022-02-18 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('setting', '0005_home_invite_link_alter_invite_receive_user_knock'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='knock',
            name='is_accepted',
        ),
    ]
