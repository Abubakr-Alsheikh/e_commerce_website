# Generated by Django 5.0.3 on 2024-05-17 14:58

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ask_yourtube', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('user_id', models.UUIDField(primary_key=True, serialize=False)),
                ('youtube_title', models.CharField(max_length=300)),
                ('youtube_link', models.URLField(unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='VideoSession',
            fields=[
                ('session_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('transcript', models.TextField(blank=True)),
                ('summary', models.TextField(blank=True)),
                ('chat_history', models.JSONField(blank=True, default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ask_yourtube.video')),
            ],
        ),
        migrations.DeleteModel(
            name='BlogPost',
        ),
    ]
