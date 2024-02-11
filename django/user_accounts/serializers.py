from django.contrib.auth.models import User
from rest_framework import serializers
import re

name_regex_pattern = r'^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s\'-]+$'

class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value: str):
        print(value)
        if len(value) < 8:
            raise serializers.ValidationError("Password must have at least 8 characters")
        return value

    def validate_name(self, value: str, field):
        if not re.fullmatch(name_regex_pattern, value):
            raise serializers.ValidationError(f"{field} is not valid!")
        if len(value) < 2:
            raise serializers.ValidationError(f"{field} is too short")
        return value
    
    def validate_first_name(self, value: str):
        return self.validate_name(value, "First Name")
    
    def validate_last_name(self, value: str):
        return self.validate_name(value, "Last Name")
    
    def create(self, validated_data):
        pwd = validated_data.pop("password")
        user = self.Meta.model(**validated_data)
        user.set_password(pwd)
        user.save()
        return user
