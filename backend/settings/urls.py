from django.urls import path, include

urlpatterns = [
    path('v1/', include('settings.v1.urls')),
]
