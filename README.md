# Armar entidades: 

## User

### Identificación
  id: 'único',
  email: 'para login',
  password: 'encriptada',
  
### Datos personales
  fullName: 'nombre completo',
  phoneNumber: 'para notificaciones',
  dni: 'identificación argentina',
  
### Rol y permisos
  role: 'laboratorista | director | jerárquico',
  isActive: 'activo/inactivo',
  
### Relaciones
  assignedConstructionSites: 'obras asignadas',
  testRequests: 'peticiones que hizo',
  testResults: 'ensayos que realizó'