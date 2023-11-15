from django.urls import path
from django.views.generic import TemplateView

app_name = 'listings'

urlpatterns = [
    path('', TemplateView.as_view(template_name="classify_portal/index.html"))
]