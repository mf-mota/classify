from django.urls import path
from .views import UserViewset
from rest_framework.routers import DefaultRouter


app_name = 'user_accounts'

router = DefaultRouter()
router.register("register", UserViewset, basename='register_user')

urlpatterns = router.urls
# [urlpatterns.append(url) for url in router.urls]