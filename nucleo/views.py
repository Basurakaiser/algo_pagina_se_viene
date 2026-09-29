from django.core.exceptions import ValidationError
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Mision


def datos_mision(mision):

    roles = [
        rol.strip().capitalize()
        for rol in mision.roles_permitidos.split(',')
        if rol.strip()
    ]

    return {
        "id": mision.id,
        "categoria": mision.get_categoria_display(),
        "roles": roles,
        "descripcion": mision.descripcion,
        "prioridad": mision.prioridad,
        "recompensa": mision.recompensa_puntos,
        "numero_pergamino": mision.numero_pergamino,
        "imagen_pergamino":
            f"pergamino{mision.numero_pergamino}.png"
    }


# ==================================================
# TABLERO
# ==================================================

@api_view(['GET'])
def obtener_mision_aleatoria(request):

    misiones = Mision.objects.filter(
        estado='disponible'
    )

    return Response([
        datos_mision(mision)
        for mision in misiones
    ])


# ==================================================
# MISIÓN ACTIVA
# ==================================================

@api_view(['GET'])
def obtener_mision_activa_usuario(
    request,
    nombre_usuario
):

    mision = Mision.objects.filter(
        asignado_a=nombre_usuario.lower(),
        estado='en_progreso'
    ).first()


    if not mision:

        return Response({
            "tiene_mision": False,
            "mensaje":
                "No tienes ninguna misión activa."
        })


    datos = datos_mision(mision)

    datos["tiene_mision"] = True

    return Response(datos)


# ==================================================
# TOMAR QUEST
# ==================================================

@api_view(['POST'])
def tomar_mision(request, mision_id):

    usuario = request.data.get(
        'usuario',
        ''
    ).lower()


    if not usuario:

        return Response({
            "error":
                "No se recibió el usuario."
        }, status=400)


    # Comprobamos que no tenga otra quest

    if Mision.objects.filter(
        asignado_a=usuario,
        estado='en_progreso'
    ).exists():

        return Response({
            "error":
                "Ya tienes una misión en progreso."
        }, status=400)


    try:

        mision = Mision.objects.get(
            id=mision_id,
            estado='disponible'
        )

    except Mision.DoesNotExist:

        return Response({
            "error":
                "Esta misión ya no está disponible."
        }, status=404)


    mision.asignado_a = usuario

    mision.estado = 'en_progreso'

    mision.fecha_tomada = timezone.now()


    try:

        mision.full_clean()

        mision.save(
            update_fields=[
                'asignado_a',
                'estado',
                'fecha_tomada'
            ]
        )

    except ValidationError as error:

        return Response({
            "error": error.message_dict
        }, status=400)


    return Response({
        "ok": True,
        "mensaje":
            "Misión tomada correctamente."
    })


# ==================================================
# ENTREGAR QUEST
# ==================================================

@api_view(['POST'])
def entregar_mision(request, mision_id):

    try:

        mision = Mision.objects.get(
            id=mision_id,
            estado='en_progreso'
        )

    except Mision.DoesNotExist:

        return Response({
            "error":
                "La misión no existe o ya fue entregada."
        }, status=404)


    mision.estado = 'entregada'

    mision.fecha_entregada = timezone.now()


    mision.save(
        update_fields=[
            'estado',
            'fecha_entregada'
        ]
    )


    return Response({
        "ok": True,
        "mensaje":
            "Quest entregada. Esperando aprobación.",
        "id": mision.id
    })