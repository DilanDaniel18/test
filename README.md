# API de Administración de Vales y Comisiones

Esta aplicación proporciona una interfaz programática para la gestión de créditos mediante vales, el cálculo automatizado de comisiones basado en el comportamiento de pago del cliente y la administración de saldos a favor por excedentes.

## Stack Tecnológico

* **Entorno de Ejecución**: Node.js v22.
* **Lenguaje**: TypeScript (ES Modules).
* **ORM**: Prisma v6.
* **Motor de Base de Datos**: PostgreSQL.
* **Gestión de Fechas**: date-fns.

---

## Instalación y Configuración

1. **Instalación de dependencias**:
```bash
npm install

```


2. **Configuración del entorno**:
Crear un archivo `.env` en la raíz del proyecto con la variable de conexión:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/vales_db?schema=public"

```


3. **Migración de la base de datos**:
```bash
npx prisma migrate dev --name init

```


4. **Carga de datos maestros (Seed)**:
```bash
node --experimental-strip-types prisma/seed.ts

```


5. **Inicio del servidor**:
```bash
npm run dev

```



---

## Arquitectura y Reglas de Negocio

### Modelado de Comisiones Personalizadas

Se implementó un sistema de rangos de comisión vinculado a cada cliente. Esto permite que el sistema consulte dinámicamente el porcentaje aplicable según el acuerdo específico del cliente (ejemplo: esquema del 25% para Cliente A y 20% para Cliente B) sin necesidad de modificar el código fuente.

### Ciclo de Vida del Vale

1. **Creación**: El sistema establece la fecha de creación y calcula la fecha límite de pago sumando 15 días naturales, cumpliendo con los requerimientos de manejo de fechas.
2. **Pagos Parciales**: Se registran abonos que reducen el saldo pendiente del vale. Mientras el saldo sea mayor a cero, el vale permanece en estado ACTIVO y no se devengan comisiones.
3. **Liquidación**: Al registrar un pago que reduce el saldo a cero, el estado cambia a PAGADO. En este momento, el sistema calcula los días transcurridos desde la creación hasta la fecha actual para determinar y aplicar la comisión correspondiente sobre el monto original.

### Gestión de Excedentes (Overpayment)

En cumplimiento con los requerimientos técnicos, si un pago excede el saldo pendiente del vale, el sistema liquida el documento y acredita la diferencia automáticamente en el campo `creditBalance` del cliente.

---

## Documentación de Endpoints

### Clientes

* `GET /api/clients`: Recupera la lista de todos los clientes registrados y sus configuraciones de rango.
* `POST /api/clients`: Registra un nuevo cliente permitiendo la definición de su tabla de comisiones en el cuerpo de la petición.

### Vales

* `POST /api/vouchers`: Crea un vale asociado a un cliente. Requiere `clientId` y `totalAmount`.
* `GET /api/vouchers/:id`: Recupera el detalle de un vale, incluyendo su saldo actual y la lista de pagos asociados.

### Pagos

* `POST /api/payments`: Registra un movimiento de pago. Realiza validaciones de monto positivo, verificación de estado del vale y procesamiento de liquidación.

---

## Ejemplo de Operación

Para validar la lógica de liquidación:

1. Crear un vale de 1000 para el cliente 1.
2. Realizar un pago de 1100.
3. El sistema responderá con el estado PAGADO, detallando la comisión calculada y confirmando que se han guardado 100 de saldo a favor en la cuenta del cliente.
