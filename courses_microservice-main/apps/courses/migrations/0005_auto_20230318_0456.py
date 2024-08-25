# Generated by Django 3.2.16 on 2023-03-18 09:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_paid_paiditem_viewed_vieweditem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paiditem',
            name='contractAddress',
        ),
        migrations.RemoveField(
            model_name='paiditem',
            name='library',
        ),
        migrations.RemoveField(
            model_name='paiditem',
            name='tokenID',
        ),
        migrations.AddField(
            model_name='paid',
            name='courses',
            field=models.ManyToManyField(to='courses.PaidItem'),
        ),
        migrations.AlterField(
            model_name='paiditem',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='courses.course'),
        ),
    ]
