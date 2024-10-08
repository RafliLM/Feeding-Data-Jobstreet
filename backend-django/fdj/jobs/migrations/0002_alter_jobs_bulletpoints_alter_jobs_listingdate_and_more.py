# Generated by Django 5.1.1 on 2024-09-05 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobs',
            name='bulletPoints',
            field=models.JSONField(default=[]),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='listingDate',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='teaser',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='title',
            field=models.CharField(),
        ),
    ]
