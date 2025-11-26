from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.username = email   # satisfy AbstractUser
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, name, password, **extra_fields)

class User(AbstractUser):
    """Custom User Model using email as username"""

    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('owner', 'Restaurant Owner'),
        ('agent', 'Delivery Agent'),
        ('admin', 'Admin'),
    ]

    # Remove first_name, last_name if you don’t need them
    first_name = None
    last_name = None

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    # username will not be used for login, but Django admin still needs it
    username = models.CharField(max_length=150, unique=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def save(self, *args, **kwargs):
        # Auto-fill username with email (to satisfy AbstractUser)
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.role})"

    class Meta:
        db_table = "users"


