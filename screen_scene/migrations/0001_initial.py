# Generated by Django 5.0.3 on 2024-07-19 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.IntegerField()),
                ('movie_id', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=255)),
                ('original_language', models.CharField(max_length=10)),
                ('original_title', models.CharField(max_length=255)),
                ('overview', models.TextField()),
                ('poster_path', models.CharField(max_length=255)),
                ('backdrop_path', models.CharField(max_length=255)),
                ('media_type', models.CharField(max_length=20)),
                ('popularity', models.FloatField()),
                ('release_date', models.DateField()),
                ('video', models.BooleanField()),
                ('vote_average', models.FloatField()),
                ('vote_count', models.IntegerField()),
            ],
        ),
    ]