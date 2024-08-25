# Generated by Django 3.2.16 on 2023-03-18 12:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_auto_20230318_0456'),
    ]

    operations = [
        migrations.CreateModel(
            name='WishListItem',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='WishList',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('user', models.UUIDField(blank=True, null=True)),
                ('total_items', models.IntegerField(default=0)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('courses', models.ManyToManyField(to='courses.Course')),
            ],
        ),
    ]
