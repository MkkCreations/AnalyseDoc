# Generated by Django 4.2 on 2023-05-01 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_full_name_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=32),
        ),
    ]