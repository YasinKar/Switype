from django.urls import path
from .views import LanguageListView, language_letters, language_words

urlpatterns = [
    path('languages/', LanguageListView.as_view()),
    path('languages/<str:code>/letters/', language_letters),
    path('languages/<str:code>/words/', language_words),
]