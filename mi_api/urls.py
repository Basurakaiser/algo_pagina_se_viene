from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from nucleo import views


# ==================================================
# ROUTER REST
# ==================================================

router = DefaultRouter()

router.register(
    r'misiones',
    views.MisionViewSet,
    basename='mision'
)


# ==================================================
# URLS
# ==================================================

urlpatterns = [
    path('admin/', admin.site.urls),

    # CRUD REST
    path(
        'api/',
        include(router.urls)
    ),

    # ==================================================
    # TABLERO
    # ==================================================

    path(
        'api/mision-aleatoria/',
        views.obtener_mision_aleatoria,
        name='mision_aleatoria'
    ),

    # ==================================================
    # MISIÓN ACTIVA
    # ==================================================

    path(
        'api/mision-activa/<str:nombre_usuario>/',
        views.obtener_mision_activa_usuario,
        name='mision_activa_usuario'
    ),

    # ==================================================
    # TOMAR QUEST
    # ==================================================

    path(
        'api/misiones/<int:mision_id>/tomar/',
        views.tomar_mision,
        name='tomar_mision'
    ),

    # ==================================================
    # ENTREGAR QUEST
    # ==================================================

    path(
        'api/misiones/<int:mision_id>/entregar/',
        views.entregar_mision,
        name='entregar_mision'
    ),
]