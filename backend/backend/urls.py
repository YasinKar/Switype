from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include([
        path('', include('words.urls')),
        path('site/', include('settings.urls')),
    ]))
]
