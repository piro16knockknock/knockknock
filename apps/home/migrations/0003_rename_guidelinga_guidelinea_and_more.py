# Generated by Django 4.0.2 on 2022-02-06 05:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='GuidelingA',
            new_name='GuidelineA',
        ),
        migrations.RenameModel(
            old_name='GuildelineQ',
            new_name='GuidelineQ',
        ),
    ]