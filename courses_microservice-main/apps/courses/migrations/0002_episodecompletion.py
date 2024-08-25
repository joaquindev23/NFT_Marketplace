# Generated by Django 3.2.16 on 2023-03-05 23:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EpisodeCompletion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.UUIDField(blank=True, null=True)),
                ('completed', models.BooleanField(default=False)),
                ('episode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.episode')),
            ],
        ),
    ]
