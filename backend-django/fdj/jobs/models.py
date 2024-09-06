from django.db import models

# Create your models here.
class Jobs(models.Model):
    title = models.CharField()
    teaser = models.CharField(max_length=255)
    companyName = models.CharField()
    location = models.CharField()
    workType = models.CharField()
    role = models.CharField()
    salary = models.CharField()
    listingDate = models.DateTimeField(auto_now_add=True)
    keyword = models.CharField()
    bulletPoints = models.JSONField(default=[])