from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User Serializer"""
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    """Register Serializer"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password2', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LoginResponseSerializer(serializers.Serializer):
    """Login Response Serializer"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
