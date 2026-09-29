from django.db import models
from django.core.exceptions import ValidationError


class Mision(models.Model):

    CATEGORIA_CHOICES = [
        ('creador_personaje', 'Creador de personaje'),
        ('creacion_lore', 'Creación de lore'),
        ('juegos_casino', 'Juegos de casino'),
        ('mecanicas_jugador', 'Mecánicas del jugador'),
        ('npc', 'Npc'),
        ('creacion_mapa', 'Creación del mapa'),
        ('rogue_lite', 'Rogue Lite'),
    ]

    ROL_CHOICES = [
        ('programador', 'Programador'),
        ('dibujante', 'Dibujante'),
        ('musico', 'Músico'),
        ('hibrido', 'Híbrido'),
        ('escritor', 'Escritor'),
    ]

    MIEMBROS_CHOICES = [
        ('kano', 'Kano'),
        ('ruoye', 'Ruoye'),
        ('vicho', 'Vicho'),
        ('lea', 'Lea'),
        ('kaiser', 'Kaiser'),
        ('walalan', 'Walalan'),
        ('hisoka', 'Hisoka'),
        ('todos', 'Todos / Libre'),
    ]

    ESTADO_CHOICES = [
        ('disponible', '⚔️ Disponible en Tablero'),
        ('en_progreso', '⏳ En Progreso (Tomada)'),
        ('entregada', '📨 Pendiente de Revisión'),
        ('completada', '💎 Completada'),
    ]

    categoria = models.CharField(
        max_length=30,
        choices=CATEGORIA_CHOICES,
        default='creador_personaje',
        verbose_name="Categoría de Misión"
    )

    roles_permitidos = models.CharField(
        max_length=200,
        default='',
        verbose_name="Roles Permitidos"
    )

    asignado_a = models.CharField(
        max_length=30,
        choices=MIEMBROS_CHOICES,
        default='todos',
        verbose_name="Asignado a"
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='disponible',
        verbose_name="Estado de la Misión"
    )

    descripcion = models.TextField(
        verbose_name="Descripción"
    )

    prioridad = models.IntegerField(
        default=1,
        verbose_name="Prioridad (Estrellas)"
    )

    recompensa_puntos = models.IntegerField(
        default=1,
        verbose_name="Puntos"
    )

    PERGAMINO_CHOICES = [
        (i, f'Pergamino {i}')
        for i in range(1, 7)
    ]

    numero_pergamino = models.IntegerField(
        choices=PERGAMINO_CHOICES,
        default=1,
        verbose_name="Número de Pergamino (PNG)"
    )

    # Fechas del historial

    fecha_tomada = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha en que se tomó"
    )

    fecha_entregada = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de entrega"
    )

    fecha_completada = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Fecha de aprobación"
    )


    def clean(self):
        super().clean()

        if (
            self.estado == 'en_progreso'
            and self.asignado_a != 'todos'
        ):

            tiene_mision = Mision.objects.filter(
                asignado_a=self.asignado_a,
                estado='en_progreso'
            ).exclude(
                id=self.id
            ).exists()

            if tiene_mision:

                raise ValidationError({
                    'asignado_a':
                    f"{self.get_asignado_a_display()} "
                    "ya tiene una misión en progreso."
                })


    def __str__(self):

        return (
            f"[{self.get_estado_display()}] "
            f"[{self.get_categoria_display()}] "
            f"→ {self.get_asignado_a_display()}"
        )


# ==================================================
# PROXY: ENTREGAS PENDIENTES
# ==================================================

class EntregaPendiente(Mision):

    class Meta:
        proxy = True

        verbose_name = "Entrega pendiente"
        verbose_name_plural = "Entregas pendientes"


# ==================================================
# PROXY: BAÚL
# ==================================================

class MisionCompletada(Mision):

    class Meta:
        proxy = True

        verbose_name = "Misión completada"
        verbose_name_plural = "Baúl de misiones completadas"