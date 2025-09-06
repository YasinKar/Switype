from rest_framework.generics import ListAPIView, RetrieveAPIView
from ..models import Release, SiteSetting, Preview, FAQ
from .serializers import (
    ReleaseSerializer,
    SiteSettingSerializer,
    PreviewSerializer,
    FAQSerializer
)

class ReleaseListView(ListAPIView):
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer


class SiteSettingsView(RetrieveAPIView):
    serializer_class = SiteSettingSerializer

    def get_object(self):
        return SiteSetting.objects.filter(is_main_setting=True).first()


class PreviewListView(ListAPIView):
    queryset = Preview.objects.all()
    serializer_class = PreviewSerializer


class FAQListView(ListAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer