from rest_framework import serializers
from .models import Mision


class MisionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mision

        fields = [
            'id',
            'categoria',
            'roles_permitidos',
            'asignado_a',
            'estado',
            'descripcion',
            'prioridad',
            'recompensa_puntos',
            'numero_pergamino',
            'fecha_tomada',
            'fecha_entregada',
            'fecha_completada',
        ]

        read_only_fields = [
            'id',
            'fecha_tomada',
            'fecha_entregada',
            'fecha_completada',
        ]