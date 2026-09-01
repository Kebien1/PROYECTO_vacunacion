using Backend.Models;

namespace Backend.Data;

public static class DatabaseSeeder
{
    public static void Seed(Conexion context)
    {
        var roleNames = new[]
        {
            "Administrador del Sistema",
            "Encargado del Centro de Salud",
            "Responsable de Vacunación / Personal de Salud",
            "Líder de Brigada Barrial",
            "Usuario Estándar / Paciente"
        };

        var roles = context.rol.ToList();
        foreach (var roleName in roleNames.Where(name => roles.All(role => role.NombreRol != name)))
        {
            var role = new Rol { NombreRol = roleName };
            context.rol.Add(role);
            roles.Add(role);
        }
        context.SaveChanges();

        var administratorRole = roles.First(role => role.NombreRol == "Administrador del Sistema");
        var managerRole = roles.First(role => role.NombreRol == "Encargado del Centro de Salud");
        var healthRole = roles.First(role => role.NombreRol == "Responsable de Vacunación / Personal de Salud");
        var brigadeRole = roles.First(role => role.NombreRol == "Líder de Brigada Barrial");
        var patientRole = roles.First(role => role.NombreRol == "Usuario Estándar / Paciente");

        var demoUsers = new[]
        {
            new Usuario { Nombre = "Administrador del Sistema", Correo = "admin.sistema", Contraseña = "admin123", IdRol = administratorRole.IdRol },
            new Usuario { Nombre = "Encargada Centro Dorado", Correo = "encargado", Contraseña = "encargado123", IdRol = managerRole.IdRol },
            new Usuario { Nombre = "Personal de Salud", Correo = "vacunador", Contraseña = "vacunador123", IdRol = healthRole.IdRol },
            new Usuario { Nombre = "Líder Barrio Norte", Correo = "lider", Contraseña = "lider123", IdRol = brigadeRole.IdRol },
            new Usuario { Nombre = "Paciente de Prueba", Correo = "paciente", Contraseña = "paciente123", IdRol = patientRole.IdRol }
        };
        foreach (var user in demoUsers.Where(user => !context.usuario.Any(existing => existing.Correo == user.Correo)))
            context.usuario.Add(user);
        context.SaveChanges();

        if (context.campaña.Any(campaign => campaign.Nombre == "Campaña Tres Días 2026"))
            return;

        var centers = new[]
        {
            new CentroSalud { Nombre = "Centro de Salud Dorado Norte", Direccion = "Av. Principal 100" },
            new CentroSalud { Nombre = "Centro de Salud Barrio Norte", Direccion = "Calle 10 esquina 4" },
            new CentroSalud { Nombre = "Centro Móvil Comunitario", Direccion = "Plaza Central" },
            new CentroSalud { Nombre = "Hospital General del Sur", Direccion = "Av. Libertadores 550" },
            new CentroSalud { Nombre = "Clínica Familiar Oriente", Direccion = "Calle Sol 12" }
        };
        context.centrosalud.AddRange(centers);
        context.SaveChanges();

        var campaign = new Campaña
        {
            Nombre = "Campaña Tres Días 2026",
            FechaInicio = new DateTime(2026, 8, 21),
            FechaFin = new DateTime(2026, 8, 23),
            IdCentro = centers[0].IdCentro
        };
        context.campaña.Add(campaign);
        
        var campaignInvierno = new Campaña
        {
            Nombre = "Campaña Invierno 2026",
            FechaInicio = new DateTime(2026, 11, 1),
            FechaFin = new DateTime(2026, 11, 30),
            IdCentro = centers[3].IdCentro
        };
        context.campaña.Add(campaignInvierno);

        var vaccines = new[]
        {
            new Vacuna { Nombre = "SR", Descripcion = "Sarampión y rubéola" },
            new Vacuna { Nombre = "SRP", Descripcion = "Sarampión, rubéola y parotiditis" },
            new Vacuna { Nombre = "Influenza", Descripcion = "Vacuna contra influenza estacional" },
            new Vacuna { Nombre = "COVID-19 Bivalente", Descripcion = "Vacuna refuerzo contra COVID-19" },
            new Vacuna { Nombre = "VPH", Descripcion = "Vacuna contra el Virus del Papiloma Humano" }
        };
        context.vacuna.AddRange(vaccines);
        context.SaveChanges();

        var populations = new[]
        {
            new PoblacionObjetivo { Descripcion = "6 meses a 4 años", EdadMin = 0, EdadMax = 4, IdCampaña = campaign.IdCampaña },
            new PoblacionObjetivo { Descripcion = "5 a 14 años", EdadMin = 5, EdadMax = 14, IdCampaña = campaign.IdCampaña },
            new PoblacionObjetivo { Descripcion = "15 a 19 años", EdadMin = 15, EdadMax = 19, IdCampaña = campaign.IdCampaña },
            new PoblacionObjetivo { Descripcion = "Adultos Mayores", EdadMin = 65, EdadMax = 120, IdCampaña = campaignInvierno.IdCampaña }
        };
        context.poblacionobjetivo.AddRange(populations);
        context.SaveChanges();

        var groups = new[]
        {
            new GrupoPriorizado { NombreGrupo = "Primera infancia", IdPoblacion = populations[0].IdPoblacion },
            new GrupoPriorizado { NombreGrupo = "Escolares", IdPoblacion = populations[1].IdPoblacion },
            new GrupoPriorizado { NombreGrupo = "Adolescentes", IdPoblacion = populations[2].IdPoblacion },
            new GrupoPriorizado { NombreGrupo = "Tercera Edad", IdPoblacion = populations[3].IdPoblacion }
        };
        context.grupopriorizado.AddRange(groups);
        context.SaveChanges();

        // Pacientes de prueba extendidos
        var patients = new[]
        {
            // Originales
            new Paciente { Nombre = "María López Pérez", Cedula = "12345678", FechaNacimiento = new DateTime(2023, 3, 15), Sexo = "F", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Carlos Rodríguez", Cedula = "23456789", FechaNacimiento = new DateTime(2018, 7, 22), Sexo = "M", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Ana Martínez Silva", Cedula = "34567890", FechaNacimiento = new DateTime(2010, 11, 5), Sexo = "F", IdGrupo = groups[2].IdGrupo },
            new Paciente { Nombre = "Pedro Gómez Torres", Cedula = "45678901", FechaNacimiento = new DateTime(2024, 1, 10), Sexo = "M", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Lucía Fernández", Cedula = "56789012", FechaNacimiento = new DateTime(2015, 5, 30), Sexo = "F", IdGrupo = groups[1].IdGrupo },
            
            // Masivos para pruebas
            new Paciente { Nombre = "Juan Carlos Pinto", Cedula = "10000001", FechaNacimiento = new DateTime(2012, 1, 1), Sexo = "M", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Sofía Vergara", Cedula = "10000002", FechaNacimiento = new DateTime(2022, 2, 2), Sexo = "F", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Mateo Silva", Cedula = "10000003", FechaNacimiento = new DateTime(2008, 3, 3), Sexo = "M", IdGrupo = groups[2].IdGrupo },
            new Paciente { Nombre = "Valentina Paz", Cedula = "10000004", FechaNacimiento = new DateTime(2023, 4, 4), Sexo = "F", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Santiago Ruiz", Cedula = "10000005", FechaNacimiento = new DateTime(2017, 5, 5), Sexo = "M", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Isabella Flores", Cedula = "10000006", FechaNacimiento = new DateTime(2009, 6, 6), Sexo = "F", IdGrupo = groups[2].IdGrupo },
            new Paciente { Nombre = "Sebastián Cruz", Cedula = "10000007", FechaNacimiento = new DateTime(2024, 7, 7), Sexo = "M", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Camila Ríos", Cedula = "10000008", FechaNacimiento = new DateTime(2014, 8, 8), Sexo = "F", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Martín Castro", Cedula = "10000009", FechaNacimiento = new DateTime(1950, 9, 9), Sexo = "M", IdGrupo = groups[3].IdGrupo },
            new Paciente { Nombre = "Valeria Ortiz", Cedula = "10000010", FechaNacimiento = new DateTime(1945, 10, 10), Sexo = "F", IdGrupo = groups[3].IdGrupo },
            new Paciente { Nombre = "Nicolás Mendoza", Cedula = "10000011", FechaNacimiento = new DateTime(2019, 11, 11), Sexo = "M", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Mariana Aguilar", Cedula = "10000012", FechaNacimiento = new DateTime(2007, 12, 12), Sexo = "F", IdGrupo = groups[2].IdGrupo },
            new Paciente { Nombre = "Diego Morales", Cedula = "10000013", FechaNacimiento = new DateTime(2022, 1, 15), Sexo = "M", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Gabriela Herrera", Cedula = "10000014", FechaNacimiento = new DateTime(2013, 2, 20), Sexo = "F", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Lucas Medina", Cedula = "10000015", FechaNacimiento = new DateTime(1960, 3, 25), Sexo = "M", IdGrupo = groups[3].IdGrupo }
        };
        context.paciente.AddRange(patients);
        context.SaveChanges();

        var lots = new[]
        {
            new Lote { CantidadDisponible = 480, FechaVencimiento = new DateTime(2027, 2, 28), IdVacuna = vaccines[0].IdVacuna },
            new Lote { CantidadDisponible = 320, FechaVencimiento = new DateTime(2027, 3, 31), IdVacuna = vaccines[1].IdVacuna },
            new Lote { CantidadDisponible = 210, FechaVencimiento = new DateTime(2026, 10, 31), IdVacuna = vaccines[2].IdVacuna },
            new Lote { CantidadDisponible = 500, FechaVencimiento = new DateTime(2027, 12, 31), IdVacuna = vaccines[3].IdVacuna },
            new Lote { CantidadDisponible = 150, FechaVencimiento = new DateTime(2025, 12, 31), IdVacuna = vaccines[4].IdVacuna }
        };
        context.lote.AddRange(lots);
        context.SaveChanges();

        var days = new[] { new DateTime(2026, 8, 21), new DateTime(2026, 8, 22), new DateTime(2026, 8, 23) };
        var journeys = days.Select((day, index) => new Jornada { Fecha = day, IdCampaña = campaign.IdCampaña }).ToArray();
        context.jornada.AddRange(journeys);
        context.SaveChanges();

        var points = new[]
        {
            new PuntoVacunacion { Nombre = "Puesto Centro de Salud", Direccion = centers[0].Direccion, IdJornada = journeys[0].IdJornada },
            new PuntoVacunacion { Nombre = "Puesto Barrio Norte", Direccion = centers[1].Direccion, IdJornada = journeys[1].IdJornada },
            new PuntoVacunacion { Nombre = "Brigada Plaza Central", Direccion = centers[2].Direccion, IdJornada = journeys[2].IdJornada },
            new PuntoVacunacion { Nombre = "Brigada Móvil Sur", Direccion = centers[3].Direccion, IdJornada = journeys[0].IdJornada }
        };
        context.puntovacunacion.AddRange(points);
        context.SaveChanges();

        context.movimientostock.AddRange(
            new MovimientoStock { TipoMovimiento = "Entrada", Cantidad = 500, FechaMovimiento = days[0], IdLote = lots[0].IdLote },
            new MovimientoStock { TipoMovimiento = "Entrada", Cantidad = 350, FechaMovimiento = days[1], IdLote = lots[1].IdLote },
            new MovimientoStock { TipoMovimiento = "Salida", Cantidad = 40, FechaMovimiento = days[2], IdLote = lots[2].IdLote },
            new MovimientoStock { TipoMovimiento = "Entrada", Cantidad = 600, FechaMovimiento = days[0].AddDays(-10), IdLote = lots[3].IdLote },
            new MovimientoStock { TipoMovimiento = "Salida", Cantidad = 100, FechaMovimiento = days[1], IdLote = lots[3].IdLote });

        context.alerta.AddRange(
            new Alerta { TipoAlerta = "Stock bajo", FechaGenerada = days[0], IdLote = lots[0].IdLote },
            new Alerta { TipoAlerta = "Vencimiento próximo", FechaGenerada = days[1], IdLote = lots[1].IdLote },
            new Alerta { TipoAlerta = "Revisión de lote", FechaGenerada = days[2], IdLote = lots[2].IdLote },
            new Alerta { TipoAlerta = "Vencimiento crítico", FechaGenerada = DateTime.Now, IdLote = lots[4].IdLote });

        var staff = context.usuario.First(user => user.Correo == "vacunador");
        var manager = context.usuario.First(user => user.Correo == "encargado");
        
        var vaccinations = new List<Vacunacion>
        {
            new Vacunacion { FechaAplicacion = days[0], Dosis = "1ra", IdPaciente = patients[0].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[0].IdLote, IdPunto = points[0].IdPunto, IdUsuarioAplicador = staff.IdUsuario },
            new Vacunacion { FechaAplicacion = days[1], Dosis = "1ra", IdPaciente = patients[1].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[1].IdLote, IdPunto = points[1].IdPunto, IdUsuarioAplicador = staff.IdUsuario },
            new Vacunacion { FechaAplicacion = days[2], Dosis = "2da", IdPaciente = patients[2].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[2].IdLote, IdPunto = points[2].IdPunto, IdUsuarioAplicador = staff.IdUsuario }
        };

        // Generar 15 vacunaciones extra para dar volumen a las tablas
        var random = new Random(12345);
        for (int i = 3; i < patients.Length; i++)
        {
            var day = days[random.Next(days.Length)];
            var patient = patients[i];
            var lot = lots[random.Next(lots.Length)];
            var point = points[random.Next(points.Length)];
            
            vaccinations.Add(new Vacunacion 
            { 
                FechaAplicacion = day, 
                Dosis = random.Next(2) == 0 ? "1ra" : "Refuerzo", 
                IdPaciente = patient.IdPaciente, 
                IdCampaña = campaign.IdCampaña, 
                IdLote = lot.IdLote, 
                IdPunto = point.IdPunto, 
                IdUsuarioAplicador = random.Next(10) > 2 ? staff.IdUsuario : manager.IdUsuario
            });
        }
        context.vacunacion.AddRange(vaccinations);

        context.indicador.AddRange(
            new Indicador { NombreIndicador = "Dosis aplicadas día 1", Valor = 6, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Dosis aplicadas día 2", Valor = 8, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Dosis aplicadas día 3", Valor = 4, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Eventos adversos graves", Valor = 0, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Cobertura inicial lograda", Valor = 55, IdCampaña = campaign.IdCampaña });

        context.reporte.AddRange(
            new Reporte { Cobertura = 10, PoblacionPendiente = 90, FechaGeneracion = days[0], IdCampaña = campaign.IdCampaña },
            new Reporte { Cobertura = 35, PoblacionPendiente = 65, FechaGeneracion = days[1], IdCampaña = campaign.IdCampaña },
            new Reporte { Cobertura = 55, PoblacionPendiente = 45, FechaGeneracion = days[2], IdCampaña = campaign.IdCampaña });

        context.SaveChanges();
    }
}