# Generated by Django 3.2.16 on 2023-01-30 18:06

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='courses',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='earned',
            field=models.FloatField(blank=True, default=0),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='student_rating',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='students',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.CreateModel(
            name='Rate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rate_number', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
                ('user', models.UUIDField(blank=True, null=True)),
                ('instructor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rate_belongs_to_instructor', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='useraccount',
            name='rating',
            field=models.ManyToManyField(blank=True, related_name='courseRating', to='user.Rate'),
        ),
    ]
