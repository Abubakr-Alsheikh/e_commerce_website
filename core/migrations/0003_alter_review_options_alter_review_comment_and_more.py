# Generated by Django 5.0.3 on 2024-04-19 15:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_item_category_alter_item_slug_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='review',
            options={'ordering': ['-date_added']},
        ),
        migrations.AlterField(
            model_name='review',
            name='comment',
            field=models.TextField(max_length=500),
        ),
        migrations.AlterField(
            model_name='review',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
        ),
    ]
