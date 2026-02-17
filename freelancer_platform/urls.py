from django.contrib import admin
from django.urls import path
from users.views import home, login_view, register_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    path('login/', login_view),
    path('register/', register_view),
]
