from django.db import models


class Release(models.Model):
    version = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    release_date = models.DateField()
    is_stable = models.BooleanField(default=True)
    file = models.FileField(upload_to='releases/', blank=True, null=True)

    def __str__(self):
        return f"Version {self.version} - {'Stable' if self.is_stable else 'Beta'}"


class SiteSetting(models.Model):
    site_description = models.TextField(verbose_name='Site Description')
    site_main_title = models.TextField(verbose_name='Main Title')
    email = models.EmailField(max_length=200, verbose_name='Email')
    copyright = models.CharField(max_length=200, verbose_name='Copyright', null=True, default='Copyright © 2025 Switype')
    maintenance_mode = models.BooleanField(default=False, verbose_name='Maintenance mode', db_index=True)
    is_main_setting = models.BooleanField(default=False, verbose_name='Main setting', db_index=True)
     
    class Meta:
        verbose_name = 'Setting'
        verbose_name_plural = 'Settings'
    
    def __str__(self) :
        return self.site_main_title


class Preview(models.Model):
    preview = models.ImageField(upload_to='previews', verbose_name='Preview')
    
    class Meta:
        verbose_name = 'Preview'
        verbose_name_plural = 'Previews'

    def __str__(self) :
        return self.preview


class FAQ(models.Model):
    question = models.TextField(verbose_name='Question')
    answer = models.TextField(verbose_name='Answer')
    
    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQ'
    
    def __str__(self) :
        return self.question