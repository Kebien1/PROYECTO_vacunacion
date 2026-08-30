-- Creación de la base de datos
CREATE DATABASE SistemaVacunacion;
GO

USE SistemaVacunacion;
GO

-- Tabla de Roles
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    NombreRol NVARCHAR(50) NOT NULL
);

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(150) UNIQUE NOT NULL,
    Contraseña NVARCHAR(200) NOT NULL,
    IdRol INT NOT NULL,
    FOREIGN KEY (IdRol) REFERENCES Roles(IdRol)
);

-- Tabla de Centros de Salud
CREATE TABLE CentrosSalud (
    IdCentro INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Direccion NVARCHAR(200) NOT NULL
);

-- Tabla de Campañas
CREATE TABLE Campañas (
    IdCampaña INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    IdCentro INT NOT NULL,
    FOREIGN KEY (IdCentro) REFERENCES CentrosSalud(IdCentro)
);

-- Tabla de Población Objetivo
CREATE TABLE PoblacionObjetivo (
    IdPoblacion INT PRIMARY KEY IDENTITY(1,1),
    Descripcion NVARCHAR(200) NOT NULL,
    EdadMin INT NOT NULL,
    EdadMax INT NOT NULL,
    IdCampaña INT NOT NULL,
    FOREIGN KEY (IdCampaña) REFERENCES Campañas(IdCampaña)
);

-- Tabla de Grupos Priorizados
CREATE TABLE GruposPriorizados (
    IdGrupo INT PRIMARY KEY IDENTITY(1,1),
    NombreGrupo NVARCHAR(100) NOT NULL,
    IdPoblacion INT NOT NULL,
    FOREIGN KEY (IdPoblacion) REFERENCES PoblacionObjetivo(IdPoblacion)
);

-- Tabla de Pacientes (personas que reciben la vacuna)
CREATE TABLE Pacientes (
    IdPaciente INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Cedula NVARCHAR(20) UNIQUE NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Sexo NVARCHAR(10) NOT NULL,
    IdGrupo INT NULL,
    FOREIGN KEY (IdGrupo) REFERENCES GruposPriorizados(IdGrupo)
);

-- Tabla de Vacunas
CREATE TABLE Vacunas (
    IdVacuna INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(200) NULL
);

-- Tabla de Lotes
CREATE TABLE Lotes (
    IdLote INT PRIMARY KEY IDENTITY(1,1),
    IdVacuna INT NOT NULL,
    CantidadDisponible INT NOT NULL,
    FechaVencimiento DATE NOT NULL,
    FOREIGN KEY (IdVacuna) REFERENCES Vacunas(IdVacuna)
);

-- Tabla de Vacunaciones
CREATE TABLE Vacunaciones (
    IdVacunacion INT PRIMARY KEY IDENTITY(1,1),
    IdPaciente INT NOT NULL,
    IdCampaña INT NOT NULL,
    IdLote INT NOT NULL,
    IdPunto INT NULL,
    IdUsuarioAplicador INT NOT NULL,
    FechaAplicacion DATE NOT NULL,
    Dosis NVARCHAR(50) NOT NULL,
    FOREIGN KEY (IdPaciente) REFERENCES Pacientes(IdPaciente),
    FOREIGN KEY (IdCampaña) REFERENCES Campañas(IdCampaña),
    FOREIGN KEY (IdLote) REFERENCES Lotes(IdLote),
    FOREIGN KEY (IdPunto) REFERENCES PuntosVacunacion(IdPunto),
    FOREIGN KEY (IdUsuarioAplicador) REFERENCES Usuarios(IdUsuario)
);

-- Tabla de Movimientos de Stock
CREATE TABLE MovimientosStock (
    IdMovimiento INT PRIMARY KEY IDENTITY(1,1),
    IdLote INT NOT NULL,
    TipoMovimiento NVARCHAR(50) NOT NULL, -- Entrada / Salida
    Cantidad INT NOT NULL,
    FechaMovimiento DATE NOT NULL,
    FOREIGN KEY (IdLote) REFERENCES Lotes(IdLote)
);

-- Tabla de Jornadas
CREATE TABLE Jornadas (
    IdJornada INT PRIMARY KEY IDENTITY(1,1),
    IdCampaña INT NOT NULL,
    Fecha DATE NOT NULL,
    FOREIGN KEY (IdCampaña) REFERENCES Campañas(IdCampaña)
);

-- Tabla de Puntos de Vacunación
CREATE TABLE PuntosVacunacion (
    IdPunto INT PRIMARY KEY IDENTITY(1,1),
    IdJornada INT NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Direccion NVARCHAR(200) NOT NULL,
    FOREIGN KEY (IdJornada) REFERENCES Jornadas(IdJornada)
);

-- Tabla de Indicadores
CREATE TABLE Indicadores (
    IdIndicador INT PRIMARY KEY IDENTITY(1,1),
    IdCampaña INT NOT NULL,
    NombreIndicador NVARCHAR(100) NOT NULL,
    Valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (IdCampaña) REFERENCES Campañas(IdCampaña)
);

-- Tabla de Reportes
CREATE TABLE Reportes (
    IdReporte INT PRIMARY KEY IDENTITY(1,1),
    IdCampaña INT NOT NULL,
    Cobertura DECIMAL(5,2) NOT NULL,
    PoblacionPendiente INT NOT NULL,
    FechaGeneracion DATE NOT NULL,
    FOREIGN KEY (IdCampaña) REFERENCES Campañas(IdCampaña)
);

-- Tabla de Alertas
CREATE TABLE Alertas (
    IdAlerta INT PRIMARY KEY IDENTITY(1,1),
    IdLote INT NOT NULL,
    TipoAlerta NVARCHAR(100) NOT NULL,
    FechaGenerada DATE NOT NULL,
    FOREIGN KEY (IdLote) REFERENCES Lotes(IdLote)
);
