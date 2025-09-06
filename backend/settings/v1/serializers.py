from rest_framework import serializers
from ..models import Release, SiteSetting, Preview, FAQ

class ReleaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Release
        fields = '__all__'


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['id', 'site_description', 'site_main_title', 'email', 'copyright']


class PreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preview
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'
