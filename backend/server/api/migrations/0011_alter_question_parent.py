# Generated by Django 4.2 on 2023-05-13 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_alter_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='parent',
            field=models.CharField(default=None, max_length=32),
        ),
    ]