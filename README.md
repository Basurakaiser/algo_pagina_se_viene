# Sistema de Quests — Django + React

Laboratorio N°8 de Desarrollo de Aplicaciones Web.

Proyecto que integra **React + Vite** con **Django REST Framework** utilizando el sistema de Quests de un videojuego.

## Funcionalidades

El CRUD permite:

- Listar Quests (GET)
- Crear Quests (POST)
- Editar Quests (PUT)
- Eliminar Quests (DELETE)

Las Quests se almacenan en **SQLite** y son las mismas que utiliza el tablón del juego.

## Ejecutar el proyecto

### Backend

Desde la carpeta principal:

```powershell
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Django:

```text
http://127.0.0.1:8000/
```

### Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173/
```

## Probar el laboratorio

En la aplicación presionar:

**⚙ Gestión de Quests**

Desde ahí se puede probar directamente el CRUD completo.

La API también está disponible en:

```text
http://127.0.0.1:8000/api/misiones/
```

## Arquitectura

```text
React → Vite Proxy → Django REST Framework → SQLite
```

Las peticiones del frontend están centralizadas en:

```text
frontend/src/api/client.js
```

Se utiliza `django-cors-headers` y el proxy de Vite para comunicar React con Django.