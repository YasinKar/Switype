from django.db import models


class Language(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    letters = models.TextField(blank=True)

    def __str__(self):
        return self.name