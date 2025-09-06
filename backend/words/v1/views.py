from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_api_key.permissions import HasAPIKey
from ..models import Language
from .serializers import LanguageSerializer
from wordfreq import top_n_list


class LanguageListView(ListAPIView):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [HasAPIKey]

@api_view(['GET'])
@permission_classes([HasAPIKey])
def language_letters(request, code):
    try:
        if code.lower() not in Language.objects.values_list('code', flat=True):
            return Response({"error": "Language not supported or alphabet not available"}, status=404)
        letters = Language.objects.get(code=code).letters
    except Exception:
        return Response({"error": "Error retrieving alphabet"}, status=500)
    return Response({"code": code, "letters": letters})


@api_view(['GET'])
@permission_classes([HasAPIKey])
def language_words(request, code):
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 20))
    try:
        words = top_n_list(code.lower(), 10000)
    except Exception:
        return Response({"error": "Language not supported or word list not available"}, status=404)
    
    total = len(words)
    start = (page - 1) * per_page
    end = start + per_page
    page_words = words[start:end]
    
    return Response({
        "code": code,
        "page": page,
        "per_page": per_page,
        "total": total,
        "words": page_words,
    })
