from django.urls import path
from .views import (
    ReleaseListView, SiteSettingsView,
    FAQListView, PreviewListView
)

urlpatterns = [
    path('releases/', ReleaseListView.as_view()),
    path('settings/', SiteSettingsView.as_view()),
    path('previews/', PreviewListView.as_view()),
    path('faqs/', FAQListView.as_view()),
]