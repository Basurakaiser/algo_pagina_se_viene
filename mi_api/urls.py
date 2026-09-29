from django.contrib import admin
from django.urls import path
from nucleo import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path(
        'api/mision-aleatoria/',
        views.obtener_mision_aleatoria,
        name='mision_aleatoria'
    ),

    path(
        'api/mision-activa/<str:nombre_usuario>/',
        views.obtener_mision_activa_usuario,
        name='mision_activa_usuario'
    ),

    path(
        'api/misiones/<int:mision_id>/tomar/',
        views.tomar_mision,
        name='tomar_mision'
    ),

    path(
        'api/misiones/<int:mision_id>/entregar/',
        views.entregar_mision,
        name='entregar_mision'
    ),
]