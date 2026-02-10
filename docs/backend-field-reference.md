# Referencia rápida de campos backend (RentExpress)

Fuente: `package-rentexpress.json` (OpenAPI del REST API).

## VehicleDTO (`#/components/schemas/VehicleDTO`)
- `vehicleId`
- `brand`
- `model`
- `manufactureYear`
- `dailyPrice`
- `licensePlate`
- `vinNumber`
- `currentMileage`
- `vehicleStatusId`
- `categoryId`
- `currentHeadquartersId`
- `createdAt`
- `updatedAt`
- `description`
- `vehicleStatus` (array de `VehicleStatusDTO`)
- `vehicleCategory` (array de `VehicleCategoryDTO`)
- `currentHeadquarters` (array de `HeadquartersDTO`)

## VehicleStatusDTO (`#/components/schemas/VehicleStatusDTO`)
- `vehicleStatusId`
- `statusName`
- `language`

## Regla práctica para frontend
1. Para estado de vehículo: usar primero `vehicle.vehicleStatus[0].statusName`.
2. Si no viene ese array en una respuesta, resolver por `vehicle.vehicleStatusId` consultando el catálogo de estados cargado en frontend.
3. Evitar inventar nombres de campo que no estén en OpenAPI.
