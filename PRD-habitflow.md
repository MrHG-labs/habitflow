# PRD: HabitFlow - Gestor de Hábitos Gamificado

**Proyecto:** Hackatón CubePath 2026
**Fecha de inicio:** 20 de marzo de 2026
**Fecha límite:** 31 de marzo de 2026

---

## 1. Descripción del Producto

**HabitFlow** es un gestor de hábitos diarios con enfoque en gamificación visual y experiencia de usuario. A diferencia de trackers tradicionales basados en listas, ofrece una vista de "jornada" horizontal donde el usuario visualiza su progreso a lo largo del día, con efectos de animate al completar tareas y un sistema de rachas que motiva la consistencia.

**Propuesta de valor única:**
- Interfaz visual atractiva con micro-interacciones
- Sistema de "Momentum" (energía diaria)
- Categorización de hábitos por nivel de energía
- Dashboard con estadísticas animadas

**Usuario objetivo:** Personas que buscan construir o romper hábitos diarios (ejercicio, estudio, hidratación, meditación, etc.)

---

## 2. Funcionalidades

### MVP (Must Have) - Prioridad Alta

| # | Funcionalidad | Descripción |
|---|---------------|-------------|
| 1 | Auth (JWT) | Registro/login con email y contraseña |
| 2 | CRUD Hábitos | Crear, editar, eliminar hábitos con nombre, descripción, frecuencia |
| 3 | Marcar completado | Checkbox con animación al completar hábito |
| 4 | Vista de "Hoy" | Timeline horizontal mostrando hábitos del día |
| 5 | Rachas (streaks) | Contador de días consecutivos cumpliendo hábitos |
| 6 | Dashboard | Resumen visual de progreso semanal |

### Features (Nice to Have) - Prioridad Media

| # | Funcionalidad | Descripción |
|---|---------------|-------------|
| 7 | Categorías | Agrupar hábitos por tipo (salud, trabajo, personal) |
| 8 | Sistema de niveles | XP por completar hábitos, nivel de usuario |
| 9 | Dark/Light mode | Tema visual oscuro/claro |
| 10 | Recordatorios | Notificaciones locales (opcional) |

### Extras (Si hay tiempo)

- Websockets para sincronización en tiempo real
- Exportación de datos (JSON)
- Estadísticas avanzadas (gráficos semanales)

---

## 3. Tech Stack

### Backend
- **Framework:** FastAPI
- **ORM:** SQLModel
- **Base de datos:** SQLite (desarrollo) / PostgreSQL (producción)
- **Auth:** JWT (python-jose) + pwdlib (argon2)
- **Migrations:** Alembic
- **Validación:** Pydantic

### Frontend
- **Framework:** Next.js 15 (con React19)
- **Build:**  Next.js bundler integrado (Turbopack en desarrollo)
- **Estado:** Zustand
- **Data fetching:** React Query (TanStack Query)
- **Estilos:** TailwindCSS
- **Routing:**  App Router (file-based routing)
- **HTTP Client:** Axios

### Despliegue
- **Plataforma:** CubePath
- **Contenedores:** Docker

---

## 4. Estructura del Proyecto

```
habitflow/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── utils/
│   ├── alembic/
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── habits/
│   │   │   │   └── dashboard/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── api/
│   ├── .env
│   └── package.json
└── docker-compose.yml
```

---

## 5. Cronograma de Desarrollo (V2 - Robusto)

> **Importante:** Este es el plan completo. Si el tiempo apremia, usar **PRD-lite** como fallback.

### Fase 1: Fundamentos (Días 1-2)
**Objetivo:** Auth funcionando + estructura lista

| # | Tarea | Depende de |
|---|-------|------------|
| 1.1 | Setup estructura proyecto + Docker | - |
| 1.2 | Configurar SQLite + SQLModel | 1.1 |
| 1.3 | Modelo User + Auth JWT | 1.2 |
| 1.4 | Endpoints /register, /login, /me | 1.3 |
| 1.5 | Setup React + Vite + Tailwind | 1.1 |
| 1.6 | Página Login/Register +拦截器 | 1.4 + 1.5 |
| 1.7 | **Verificación:** Auth funcional | 1.6 |

### Fase 2: Core Hábitos (Días 3-4)
**Objetivo:** CRUD hábitos completo

| # | Tarea | Depende de |
|---|-------|------------|
| 2.1 | Modelo Habit + HabitProgress | 1.2 |
| 2.2 | Endpoints CRUD /habits | 2.1 |
| 2.3 | Componente: Lista de hábitos | 1.5 |
| 2.4 | Formulario crear/editar hábito | 2.2 + 2.3 |
| 2.5 | Integrar con React Query | 2.4 |
| 2.6 | **Verificación:** CRUD funciona | 2.5 |

### Fase 3: Progreso y Rachas (Días 5-6)
**Objetivo:** Completar hábitos + rachas

| # | Tarea | Depende de |
|---|-------|------------|
| 3.1 | Endpoint marcar completado | 2.1 |
| 3.2 | UI: Checkbox con animación | 2.3 |
| 3.3 | Calcular rachas (lógica) | 2.1 |
| 3.4 | Componente: Streak badge | 3.3 |
| 3.5 | Dashboard básico | 3.1 + 3.4 |
| 3.6 | **Verificación:** Progreso guardado | 3.2 + 3.5 |

### Fase 4: Gamificación (Días 7-8)
**Objetivo:** XP, niveles, motivaciones

| # | Tarea | Depende de |
|---|-------|------------|
| 4.1 | Sistema de XP (lógica) | 3.1 |
| 4.2 | Actualizar nivel automáticamente | 4.1 |
| 4.3 | Badges visuales | 4.2 |
| 4.4 | Animaciones de celebración | 4.3 |
| 4.5 | **Verificación:** Gamificaciónfunciona | 4.4 |

### Fase 5: UI/UX Polish (Días 9-10)
**Objetivo:** Interfaz atractiva

| # | Tarea | Depende de |
|---|-------|------------|
| 5.1 | Dark/Light mode | - |
| 5.2 | Responsive design | - |
| 5.3 | Estados loading/error | - |
| 5.4 | Micro-interacciones | - |
| 5.5 | **Verificación:** UI pulida | 5.4 |

### Fase 6: Despliegue (Días 11-12)
**Objetivo:** En producción

| # | Tarea | Depende de |
|---|-------|------------|
| 6.1 | Un solo Dockerfile | - |
| 6.2 | Probar contenedor localmente | 6.1 |
| 6.3 | Configurar CubePath | 6.2 |
| 6.4 | Desplegar y verificar | 6.3 |
| 6.5 | **Verificación:** Produccción funciona | 6.4 |

### Fase 7: Cierre (Días 13-14)
**Objetivo:** Documentación y registro

| # | Tarea | Depende de |
|---|-------|------------|
| 7.1 | README con screenshots | - |
| 7.2 | Probar todas las funcionalidades | - |
| 7.3 | Bug fixing final | 7.2 |
| 7.4 | Registrar en hackatón | 7.1 + 7.3 |
| 7.5 | **ENTREGA FINAL** | 7.4 |

---

### Buffers y Contingencias

| Día | Buffer |
|-----|--------|
| D2 | Si Auth no funciona → PRD-lite |
| D4 | Si CRUD lento → simplificar |
| D6 | Si rachas complicadas → solo contador |
| D8 | Si gamificación pesada → omitir niveles |
| D12 | **Si no Deploy → PRD-lite** |

---

> **Nota:** Este cronograma es para **V2 robusta**. Si hay cualquier signo de retraso, cambiar inmediatamente a **PRD-lite**.

---

## 6. Criterios de Éxito

- [ ] Usuario puede registrarse e iniciar sesión
- [ ] Usuario puede crear, editar y eliminar hábitos
- [ ] Usuario puede marcar hábitos completados
- [ ] Se visualizan las rachas correctamente
- [ ] Dashboard muestra progreso semanal
- [ ] Interfaz es visualmente atractiva
- [ ] Desplegado y funcional en CubePath
- [ ] README con documentación completa

---

## 7. Notas

- **Frontend-first en UX:** El criterio principal de evaluación es experiencia de usuario, invertir tiempo en animaciones y UI
- **MVP realista:** No sobreingenierizar - primero funcional, después pulir
- **CubePath:** Usar los $15 gratis para 2 servidores nano
- **Estrategia DB:** Empezar con SQLite para desarrollo rápido, migrar a PostgreSQL si hay tiempo
- **Un solo contenedor:** Frontend build se sirve desde FastAPI en producción
- **Si hay retraso:** Cambiar inmediatamente a PRD-lite

---

## 7.5 Estrategia de Despliegue

### Un Solo Contenedor

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Build frontend
COPY frontend/ .
RUN npm install && npm run build

# Copiar app
COPY backend/ .

# Ejecutar migración y start
RUN python -c "from app.database import init_db; init_db()"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**El backend sirve el frontend estático:**

```python
# app/main.py
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/")
async def serve_react():
    return FileResponse("dist/index.html")
```

**Ventajas:**
- Un solo contenedor → menos config
- CubePath más simple
- Menos puntos de fallo

---

## 8. Arquitectura Mantenible y Escalable

### Principios de Diseño

| Principio | Aplicación |
|-----------|------------|
| **SOLID** | Separar responsabilidades en routers, services, models |
| **DRY** | Componentes reutilizables, hooks personalizados |
| **KISS** | Código simple y legible, evitar sobreingeniería |
| **YAGNI** | No agregar features hasta que sean necesarias |

---

### Backend - Estructura Escalable

```
backend/
├── app/
│   ├── main.py                 # Entry point + lifespan
│   ├── config.py               # Configuración centralizada
│   ├── database.py             # Conexión DB
│   ├── models/                # Modelos SQLModel
│   │   ├── user.py
│   │   ├── habit.py
│   │   └── progress.py
│   ├── schemas/               # Pydantic (request/response)
│   │   ├── user.py
│   │   ├── habit.py
│   │   └── token.py
│   ├── routers/               # Endpoints (separados por dominio)
│   │   ├── auth.py
│   │   ├── habits.py
│   │   └── progress.py
│   ├── services/             # Lógica de negocio
│   │   ├── auth_service.py
│   │   └── habit_service.py
│   ├── dependencies/          # FastAPI dependencies
│   │   └── auth.py
│   └── utils/                 # Helpers
├── alembic/
├── .env
└── requirements.txt
```

**Reglas:**
- Cada router solo maneja rutas y validación básica
- La lógica de negocio va en `services/`
- Schemas отделены de models (DTO pattern)
- Usar `Depends()` para inyección de dependencias

---

### Frontend - Componentes Reutilizables (Next.js App Router)

```
frontend/src/
├── app/                      # Next.js App Router (route groups)
│   ├── (auth)/               # Route group para auth
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/          # Route group para dashboard
│   │   ├── habits/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing/redirect
├── components/
│   ├── common/               # Button, Input, Card, Modal
│   ├── habits/               # HabitCard, HabitForm, HabitList
│   ├── dashboard/           # StatsCard, StreakBadge, ProgressChart
│   └── layout/               # Header, Sidebar, Layout
├── hooks/
│   ├── useAuth.ts
│   ├── useHabits.ts
│   └── useStreaks.ts
├── stores/                   # Zustand
│   ├── authStore.ts
│   └── habitStore.ts
├── api/                      # Axios/fetch instance + endpoints
│   ├── client.ts
│   ├── auth.ts
│   └── habits.ts
├── types/                    # TypeScript interfaces
│   ├── user.ts
│   └── habit.ts
└── utils/                    # Helpers
    ├── date.ts
    └── validators.ts
```

**Reglas App Router:**
- Usar `app/` como directorio de rutas
- Route groups con `(nombre)` para organizar rutas sin afectar URL
- Server Components por defecto, agregar "use client" solo cuando sea necesario
- Metadata para SEO en `layout.tsx` o `page.tsx`

**Reglas:**
- Componentes pequeños y enfocado (single responsibility)
- Props tipados con TypeScript strict
- No lógica de negocio en componentes (usar hooks)
- API centralizada, no llamadas directas en componentes

---

### TypeScript Estricto (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### Manejo de Errores Centralizado

**Backend:**
```python
# Exception handlers en main.py
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content=exc.errors())
```

**Frontend:**
```typescript
// Axios interceptors para errores globales
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

---

### Configuración por Entorno

```
.env               # Desarrollo local
.env.production   # CubePath
```

**Backend (Pydantic Settings):**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
```

---

### Testing (Pytest + Vitest)

```
backend/tests/
├── test_auth.py
├── test_habits.py
└── conftest.py

frontend/src/__tests__/
├── hooks.test.ts
└── components.test.tsx
```

**Scope mínimo para hackatón:**
- Tests de integración para API críticas (auth, CRUD habits)
- Tests unitarios para funciones de utilidad

---

### Documentación API

- FastAPI genera Swagger automáticamente en `/docs`
- Incluir descripciones en cada endpoint
- Ejemplos de request/response en schemas

---

## 10. Riesgos Identificados y Mitigaciones

| # | Riesgo | Impacto | Mitigación |
|---|--------|---------|------------|
| 1 | Scope terlalu luas | No se termina a tiempo | PRD-lite con 6 features mínimas |
| 2 | PostgreSQL en CubePath complejo | DB no funciona | SQLite como fallback, luego migrar |
| 3 | Multi-contenedor Docker | Más puntos de fallo | Un solo contenedor |
| 4 | Sin buffer de tiempo | Cronograma ajustado | Reducir features + días de reserva |
| 5 | Dependencias entre tareas no claras | Bloqueos inesperados | Definir orden específico |
| 6 | Sin estrategia CORS | Frontend no comunica con API | Configurar CORS en FastAPI |
| 7 | Sesión expira sin refresh | Usuario pierde sesión | Implementar refresh token |
| 8 | Modelo de progreso no definido | No se guarda estado | Agregar modelo HabitProgress |

---

## 11. Dependencias entre Tareas

```
D1-2: Auth (login/register) ──────┐
                                  ├─────► D3-4: CRUD Hábitos
D1: Setup DB + Models ────────────┘

D3-4: CRUD Hábitos ───────────────┴─────► D5-6: Rachas + Dashboard
                                                    │
                                                    ├─────► D7: Gamificación (V2)
                                                    └─────► D8: UI Polish
```

---

## 12. Modelo de Datos (Schema)

### User
```python
class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    username: str
    xp: int = Field(default=0)
    level: int = Field(default=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Habit
```python
class Habit(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    description: str | None = None
    icon: str = "📌"
    color: str = "#6366f1"
    frequency: str = "daily"  # daily, weekly
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### HabitProgress
```python
class HabitProgress(SQLModel, table=True):
    id: int = Field(primary_key=True)
    habit_id: int = Field(foreign_key="habit.id")
    user_id: int = Field(foreign_key="user.id")
    completed: bool = Field(default=False)
    completed_at: datetime | None = None
    date: date  # Fecha del registro (único por habit+date)
```

---

## 13. Configuración CORS

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 14. Auth con Refresh Token

### Flujo:
1. Login → Access Token (15 min) + Refresh Token (7 días)
2. Access Token expira → Usar Refresh Token → Nuevo Access Token
3. Logout → Invalidar Refresh Token

### Endpoints:
- `POST /auth/login` → {access_token, refresh_token, user}
- `POST /auth/refresh` → {access_token}
- `POST /auth/logout` → Invalida refresh token

---

## 15. Commands Rápidos

```bash
# Setup backend
cd backend && uv pip install -r requirements.txt
uvicorn app.main:app --reload

# Setup frontend (Next.js)
cd frontend && npm install
npm run dev          # Desarrollo (Turbopack)
npm run build        # Build producción
npm run start        # Ejecutar producción

# Docker
docker-compose up --build

# Migraciones
alembic upgrade head
alembic revision --autogenerate -m "descripcion"

# Linting
cd backend && ruff check .
cd frontend && npm run lint
```