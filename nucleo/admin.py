from django.contrib import admin
from django import forms
from django.utils import timezone

from .models import (
    Mision,
    EntregaPendiente,
    MisionCompletada
)


class MisionAdminForm(forms.ModelForm):

    roles_permitidos = forms.MultipleChoiceField(
        choices=Mision.ROL_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        label="Roles Permitidos"
    )

    class Meta:
        model = Mision
        fields = '__all__'


    def clean_roles_permitidos(self):

        return ",".join(
            self.cleaned_data['roles_permitidos']
        )


    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        if self.instance and self.instance.roles_permitidos:

            self.fields['roles_permitidos'].initial = (
                self.instance.roles_permitidos.split(',')
            )


# ==================================================
# MISIONES NORMALES
# ==================================================

@admin.register(Mision)
class MisionAdmin(admin.ModelAdmin):

    form = MisionAdminForm

    list_display = (
        'descripcion_corta',
        'categoria',
        'asignado_a',
        'estado',
        'prioridad',
        'recompensa_puntos',
    )

    list_filter = (
        'estado',
        'categoria',
        'asignado_a',
        'prioridad',
    )

    search_fields = (
        'descripcion',
        'asignado_a',
    )


    def get_queryset(self, request):

        queryset = super().get_queryset(request)

        # No mostramos entregadas ni completadas
        return queryset.exclude(
            estado__in=['entregada', 'completada']
        )


    @admin.display(description="Descripción")
    def descripcion_corta(self, obj):

        if len(obj.descripcion) > 60:
            return obj.descripcion[:60] + "..."

        return obj.descripcion


# ==================================================
# ENTREGAS PENDIENTES
# ==================================================

@admin.register(EntregaPendiente)
class EntregaPendienteAdmin(admin.ModelAdmin):

    list_display = (
        'descripcion_corta',
        'asignado_a',
        'recompensa_puntos',
        'fecha_tomada',
        'fecha_entregada',
    )

    list_filter = (
        'asignado_a',
        'categoria',
        'fecha_entregada',
    )

    search_fields = (
        'descripcion',
        'asignado_a',
    )

    actions = [
        'aprobar_misiones'
    ]


    def get_queryset(self, request):

        return super().get_queryset(request).filter(
            estado='entregada'
        )


    @admin.display(description="Descripción")
    def descripcion_corta(self, obj):

        if len(obj.descripcion) > 60:
            return obj.descripcion[:60] + "..."

        return obj.descripcion


    @admin.action(description="💎 Aprobar misiones seleccionadas")
    def aprobar_misiones(self, request, queryset):

        queryset.update(
            estado='completada',
            fecha_completada=timezone.now()
        )


# ==================================================
# BAÚL DE MISIONES COMPLETADAS
# ==================================================

@admin.register(MisionCompletada)
class MisionCompletadaAdmin(admin.ModelAdmin):

    list_display = (
        'descripcion_corta',
        'asignado_a',
        'categoria',
        'recompensa_puntos',
        'prioridad',
        'fecha_tomada',
        'fecha_entregada',
        'fecha_completada',
    )

    list_filter = (
        'asignado_a',
        'categoria',
        'prioridad',
        'fecha_completada',
    )

    search_fields = (
        'descripcion',
        'asignado_a',
    )

    ordering = (
        '-fecha_completada',
    )


    def get_queryset(self, request):

        return super().get_queryset(request).filter(
            estado='completada'
        )


    @admin.display(description="Descripción")
    def descripcion_corta(self, obj):

        if len(obj.descripcion) > 60:
            return obj.descripcion[:60] + "..."

        return obj.descripcion