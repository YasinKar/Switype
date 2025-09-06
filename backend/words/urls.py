from django.urls import path, include

urlpatterns = [
    path('v1/', include('words.v1.urls')),
]
