# Generated by Django 4.0.2 on 2022-02-07 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('setting', '0002_alter_home_rent_date_alter_livein_end_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='livein',
            name='home',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='setting.home'),
        ),
    ]