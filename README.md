# Sistema de Gestion de Laboratorio Vial

Este proyecto es una aplicacion web orientada a laboratorios viales y de obra.
La idea es centralizar: 

- La carga y gestion de ensayos (suelo, hormigon, asfalto).
- La generacion de informes en PDF listos para presentar a la inspeccion.
- La gestion de inventario y estado de equipos.
- El flujo de solicitudes entre directores de obra, personal jerarquico y laboratoristas.

Es una app pensada para ser **practica**, **intuitiva**, usable tanto en **celulares** como en **escritorio**, y con una arquitectura limpia para poder escalarla.

## Arquitectura General

La aplicacion esta dividida en tres grandes bloques:

- **Frontend**: SPA en React + Vite + TypeScript.
- **Backend**: API REST en Node.js, con enfoque modular por dominio.
- **Base de datos**: Relacional (PosgreSQL) para asegurar integridad y trazabilidad.

A nivel alto, la arquitectura sigue la idea de "capas limpias":

- **Capa de presentacion (frontend)**: pantallas, componentes, navegacion y consumo de la API.
- **Capa de aplicacion (backend)**: casos de uso, orquestacion de logica de negocio.
- **Capa de dominio (backend)**: entidades, reglas de negocio, validaciones core.
- **Capa de infraestructura (backend)**: base de datos, envio de mails, almacenamiento de PDFs, logging.

La comunicacion es: 

`Frontend (HTTPS) → API REST (JSON) → Servicios de dominio → Base de datos / PDFs / Mail` 

## Roles de sistema

El sistema maneja tres tipos de usuarios principales:

- **Laboratorista**
    - Carga de ensayos de suelo, hormigo y asfalto.
    - Actualizan el estado/progreso de los ensayos.
    - Generan y exportan informes en PDF.
    - Gestionan inventario y reportan equipos en mantenimiento/rotos.
    - Visualizan ensayos realizados e informes en PDF.

- **Directores de obra**
    - Crean solicitudes de ensayos vinculados a una obra.
    - Consultan el estado/progreso de los ensayos.
    - Visualizan ensayos realizados e informes en PDF.
    - Ven estado de equipos e inventario relevante para su obra.

- **Personal jerarquico**
    - Visualiza ensayos pendientes por obra.
    - Crea solicitudes de ensaayos.
    - Ve y gestiona solicitudes (puede crear prioridades).
    - Registra y da de baja laboratoristas.
    - Ve estado de equipos (rots, en mantenimiento, faltantes) e inventario.

La logica general es: 

1. Un director de obra o personal jerarquico crea una **solicitud de ensayo**.
2. La solicitud queda en una bandeja para el **laboratorio** y se envia un mail al laboratorista responsable.
3. El laboratorista toma la solicitud, la trabja y actualiza el **estado del ensayo**.
4. Al finalizar, se genera un **informe en pdf**, se da aviso al director de la obra mediate la app y queda disponible para directores y jerarquicos.
5. En paralelo, los laboratoristas pueden:
    - Reportar equipos rotos/en mantenimiento.
    - Actualizar inventario.
    - Enviar notificaciones via mail asociadas a cambios importantes.

## Modulos de dominio 

Para mantener la app ordenada, se agrupa la logica en modulos de dominio:

- **Usuarios y roles**
    - Entidades: Usuario, Rol.
    - Funciones: autenticación, autorización, alta/baja de laboratoristas.

- **Obras**
    - Entidades: Obra.
    - Funciones: relacionar ensayos, solicitudes y responsables.

- **Solicitudes de ensayo**
    - Entidades: SolicitudEnsayo.
    - Funciones: 
        - Crear solicitudes desde directores o jerarquicos.
        - Manejar estados: `pendiente`, `aceptada`, `en_proceso`, `finalizada`, `cancelada`.
        - Registrar prioridad.

- **Ensayos**
    - Entidades: Ensayo, EnsayoSuelo, EnsayoHormigon, EnsayoAsfalto.
    - Funciones: 
        - Carga de datos tecnicos de cada tipo de ensayo.
        - Asociacion a una solicitud y a una obra.
        - Cambio de estado/progreso del ensayo.

- **Informes (PDF)**
    - Entidades: InformeEnsayo.
    - Funciones:
        - Generar PDFs profecionales a partir de datos del ensayo.
        - Guardar metadatos (ruta del archivo, versión, fecha, responsable).
        - Permitir descarga/visualizacion.

- **Equipos y mantenimiento**
    - Entidades: Equipo, ReporteManteniminto.
    - Funciones:
        - Registrar estado: `operativo`, `en_mantenimiento`, `roto`, `faltante`.
        - Generar historial de mantenimiento y reportes.

- **Inventario**
    - Entidades: ItemInventario.
    - Funciones: 
        - Registrar existencias de materiales, insumos, reactivos, etc.
        - Actualizar cantidades y estados.

- **Notificaciones / Emails**
    - Entidades: Notificacion
    - Funciones:
        - Enviar mails ante eventos clave (nueva solicitud, ensayo finalizado, cambio de prioridad).
        - Manejar templates básicos de correo.

## Arquitectura del backend

**Stack:**

- Node.js
- TypeScript
- Framework: Express
- ORM: TypeORM
- Base de datos: PostgreSQL

El backend se organiza por módulos de dominio, respetando una separación de capas:

- `src/
  - modules/
    - users/
      - users.controller.ts
      - users.service.ts
      - users.repository.ts
      - users.entity.ts
      - users.routes.ts (si aplica)
    - auth/
    - obras/
    - solicitudes/
    - ensayos/
    - informes/
    - equipos/
    - inventario/
  - core/
    - http/
    - errors/
    - middleware/
    - config/
    - mail/
    - pdf/
  - config/
    - db/
    - logger/
`

### Capas

- **Controller / Routes**
    - Exponen endpoints REST.
    - Validan la entrada (DTOs) y llaman a los servicios.

- **Services (Aplicación)**
    - Contienen la lógica de los casos de uso: crear solicitud, actualizar estado, generar informe, etc.
    - Combinan repositorios y servicios de infraestructura (mail, pdf).

- **Repositories (Infraestructura)**
    - Se encargan de hablar con la base de datos usando TypeORM.
    - No contienen lógica de negocio, sólo acceso a datos.

- **Dominio (Entities / Rules)**
    - Modelan las entidades del sistema y las reglas más importantes.

### API REST (ejemplos)

- `POST /auth/login`
- `POST /usuarios` (alta laboratorista, jerárquico, etc.)
- `GET /obras`
- `POST /solicitudes`
- `GET /solicitudes?estado=pendiente`
- `PATCH /solicitudes/:id/estado`
- `POST /ensayos`
- `GET /ensayos/:id`
- `GET /ensayos/:id/pdf`
- `GET /equipos`
- `PATCH /equipos/:id/estado`
- `GET /inventario`
- `POST /inventario`

La idea es mantener los endpoints **predecibles y consistentes**.

## Arquitectura del frontend

**Stack:**

- React
- Vite
- TypeScript

- `src/
  - app/
    - router.tsx
    - providers.tsx
  - features/
    - auth/
      - pages/
      - components/
      - hooks/
      - api.ts
    - ensayos/
    - solicitudes/
    - equipos/
    - inventario/
    - usuarios/
  - shared/
    - components/
    - hooks/
    - layouts/
    - utils/
    - types/
`


### Principios

- **Feature-based**: agrupar por funcionadlidad no solo portipo de archivo.
- **Mobile first**: diseño pensado para usarse en celular y luego adaptado a escritorio.
- **Estados claros**: loaders, empty states, mensajes de error y de exito visibles.


### Pantallas principales

- Login
- Dashboard (según rol)
- Listado de solicitudes
- Carga/edición de ensayos
- Detalle de ensayo + botón para PDF
- Gestión de equipos
- Gestión de inventario
- Administración de usuarios (sólo jerárquico)


## Infraestructura y despliegue

La idea es mantener una infraestructura simple pero lista para producción:

- **Backend**
    - Deploy en un servicio como VPS.
    - Variables de entorno para credenciales, JWT secret, conexión a DB, SMTP, etc.

- **Base de datos**
    - PostgreSQL administrado (Neon, Supabase o similar).

- **Frontend**
    - Build estático (Vite) desplegado en servicios como Netlify / Vercel / S3 + CloudFront.

- **Almacenamiento de PDFs**
    - Servicio tipo S3 (S3, R2, etc.), guardando sólo la ruta en la base de datos.

- **Logs y monitoreo**
    - Logs estructurados en el backend.
    - Manejo centralizado de errores.


## Seguridad y permisos

- **Autenticación**
  - JWT con refresh tokens.
  - Almacenar sólo el access token en el frontend (por ejemplo en memory + HTTP-only cookie, según enfoque).

- **Autorización (Roles)**
  - Middleware/guards según rol:
    - Rutas exclusivas para laboratoristas.
    - Rutas exclusivas para directores.
    - Rutas exclusivas para jerárquicos.

- **Validación**
  - Validación de entrada en backend (DTOs / schemas).
  - Validaciones básicas en frontend para mejor UX.


## Roadmap técnico

1. Definir modelos de base de datos (TypeORM + PostgreSQL).
2. Implementar módulos base del backend:
    - Auth + usuarios
    - Obras
    - Solicitudes
    - Ensayos
3. Agregar generación de PDFs de ensayos.
4. Implementar gestión de equipos e inventario.
5. Crear frontend con flujos básicos por rol.
6. Añadir notificaciones vía email.
7. Pulir UI/UX, estados de carga y manejo de errores.
8. Preparar demo, documentación y versión deployada.
