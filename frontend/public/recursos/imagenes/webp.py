from PIL import Image
import os

# Carpeta donde está ubicado este script
carpeta = os.path.dirname(os.path.abspath(__file__))

for archivo in os.listdir(carpeta):
    if archivo.lower().endswith(".png"):

        ruta_png = os.path.join(carpeta, archivo)

        # Crea el WEBP en esta misma carpeta
        nombre_webp = os.path.splitext(archivo)[0] + ".webp"
        ruta_webp = os.path.join(carpeta, nombre_webp)

        try:
            with Image.open(ruta_png) as imagen:

                # Mantener transparencia si el PNG la tiene
                if imagen.mode in ("RGBA", "LA") or "transparency" in imagen.info:
                    imagen = imagen.convert("RGBA")
                else:
                    imagen = imagen.convert("RGB")

                imagen.save(
                    ruta_webp,
                    "WEBP",
                    lossless=True,
                    method=6
                )

            print(f"✓ {archivo} -> {nombre_webp}")

        except Exception as e:
            print(f"✗ Error con {archivo}: {e}")

print("\nConversión terminada.")
input("Presiona ENTER para cerrar...")
