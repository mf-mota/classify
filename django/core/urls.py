from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-account/', include('user_accounts.urls', namespace="user_accounts")),
    path('api/', include('classify_portal_api.urls', namespace="classify_portal_api")),
    path('', include('listings.urls', namespace="listings")),
]

