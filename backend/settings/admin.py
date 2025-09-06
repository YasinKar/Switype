from django.contrib import admin
from .models import FAQ, Release, SiteSetting

admin.site.register(FAQ)

admin.site.register(SiteSetting)

admin.site.register(Release)