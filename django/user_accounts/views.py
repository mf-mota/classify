from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import NewUserSerializer


# Create your views here.

class UserViewset(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer = NewUserSerializer
    authentication_classes = []
    
    def create(self, request):
        serializer = self.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)