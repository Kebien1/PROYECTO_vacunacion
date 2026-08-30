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
            new CentroSalud { Nombre = "Centro Móvil Comunitario", Direccion = "Plaza Central" }
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

        var vaccines = new[]
        {
            new Vacuna { Nombre = "SR", Descripcion = "Sarampión y rubéola" },
            new Vacuna { Nombre = "SRP", Descripcion = "Sarampión, rubéola y parotiditis" },
            new Vacuna { Nombre = "Influenza", Descripcion = "Vacuna contra influenza estacional" }
        };
        context.vacuna.AddRange(vaccines);
        context.SaveChanges();

        var populations = new[]
        {
            new PoblacionObjetivo { Descripcion = "6 meses a 4 años", EdadMin = 0, EdadMax = 4, IdCampaña = campaign.IdCampaña },
            new PoblacionObjetivo { Descripcion = "5 a 14 años", EdadMin = 5, EdadMax = 14, IdCampaña = campaign.IdCampaña },
            new PoblacionObjetivo { Descripcion = "15 a 19 años", EdadMin = 15, EdadMax = 19, IdCampaña = campaign.IdCampaña }
        };
        context.poblacionobjetivo.AddRange(populations);
        context.SaveChanges();

        var groups = new[]
        {
            new GrupoPriorizado { NombreGrupo = "Primera infancia", IdPoblacion = populations[0].IdPoblacion },
            new GrupoPriorizado { NombreGrupo = "Escolares", IdPoblacion = populations[1].IdPoblacion },
            new GrupoPriorizado { NombreGrupo = "Adolescentes", IdPoblacion = populations[2].IdPoblacion }
        };
        context.grupopriorizado.AddRange(groups);
        context.SaveChanges();

        // Pacientes de prueba
        var patients = new[]
        {
            new Paciente { Nombre = "María López Pérez", Cedula = "12345678", FechaNacimiento = new DateTime(2023, 3, 15), Sexo = "F", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Carlos Rodríguez", Cedula = "23456789", FechaNacimiento = new DateTime(2018, 7, 22), Sexo = "M", IdGrupo = groups[1].IdGrupo },
            new Paciente { Nombre = "Ana Martínez Silva", Cedula = "34567890", FechaNacimiento = new DateTime(2010, 11, 5), Sexo = "F", IdGrupo = groups[2].IdGrupo },
            new Paciente { Nombre = "Pedro Gómez Torres", Cedula = "45678901", FechaNacimiento = new DateTime(2024, 1, 10), Sexo = "M", IdGrupo = groups[0].IdGrupo },
            new Paciente { Nombre = "Lucía Fernández", Cedula = "56789012", FechaNacimiento = new DateTime(2015, 5, 30), Sexo = "F", IdGrupo = groups[1].IdGrupo }
        };
        context.paciente.AddRange(patients);
        context.SaveChanges();

        var lots = new[]
        {
            new Lote { CantidadDisponible = 480, FechaVencimiento = new DateTime(2027, 2, 28), IdVacuna = vaccines[0].IdVacuna },
            new Lote { CantidadDisponible = 320, FechaVencimiento = new DateTime(2027, 3, 31), IdVacuna = vaccines[1].IdVacuna },
            new Lote { CantidadDisponible = 210, FechaVencimiento = new DateTime(2026, 10, 31), IdVacuna = vaccines[2].IdVacuna }
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
            new PuntoVacunacion { Nombre = "Brigada Plaza Central", Direccion = centers[2].Direccion, IdJornada = journeys[2].IdJornada }
        };
        context.puntovacunacion.AddRange(points);
        context.SaveChanges();

        context.movimientostock.AddRange(
            new MovimientoStock { TipoMovimiento = "Entrada", Cantidad = 500, FechaMovimiento = days[0], IdLote = lots[0].IdLote },
            new MovimientoStock { TipoMovimiento = "Entrada", Cantidad = 350, FechaMovimiento = days[1], IdLote = lots[1].IdLote },
            new MovimientoStock { TipoMovimiento = "Salida", Cantidad = 40, FechaMovimiento = days[2], IdLote = lots[2].IdLote });

        context.alerta.AddRange(
            new Alerta { TipoAlerta = "Stock bajo", FechaGenerada = days[0], IdLote = lots[0].IdLote },
            new Alerta { TipoAlerta = "Vencimiento próximo", FechaGenerada = days[1], IdLote = lots[1].IdLote },
            new Alerta { TipoAlerta = "Revisión de lote", FechaGenerada = days[2], IdLote = lots[2].IdLote });

        var staff = context.usuario.First(user => user.Correo == "vacunador");
        context.vacunacion.AddRange(
            new Vacunacion { FechaAplicacion = days[0], Dosis = "1ra", IdPaciente = patients[0].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[0].IdLote, IdPunto = points[0].IdPunto, IdUsuarioAplicador = staff.IdUsuario },
            new Vacunacion { FechaAplicacion = days[1], Dosis = "1ra", IdPaciente = patients[1].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[1].IdLote, IdPunto = points[1].IdPunto, IdUsuarioAplicador = staff.IdUsuario },
            new Vacunacion { FechaAplicacion = days[2], Dosis = "2da", IdPaciente = patients[2].IdPaciente, IdCampaña = campaign.IdCampaña, IdLote = lots[2].IdLote, IdPunto = points[2].IdPunto, IdUsuarioAplicador = staff.IdUsuario });

        context.indicador.AddRange(
            new Indicador { NombreIndicador = "Dosis aplicadas día 1", Valor = 1, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Dosis aplicadas día 2", Valor = 1, IdCampaña = campaign.IdCampaña },
            new Indicador { NombreIndicador = "Dosis aplicadas día 3", Valor = 1, IdCampaña = campaign.IdCampaña });

        context.reporte.AddRange(
            new Reporte { Cobertura = 10, PoblacionPendiente = 90, FechaGeneracion = days[0], IdCampaña = campaign.IdCampaña },
            new Reporte { Cobertura = 20, PoblacionPendiente = 80, FechaGeneracion = days[1], IdCampaña = campaign.IdCampaña },
            new Reporte { Cobertura = 30, PoblacionPendiente = 70, FechaGeneracion = days[2], IdCampaña = campaign.IdCampaña });

        context.SaveChanges();
    }
}