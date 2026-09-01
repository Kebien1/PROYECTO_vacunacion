using Microsoft.EntityFrameworkCore;
using Backend.Models;
namespace Backend.Data;

public class Conexion : DbContext
{
    public Conexion(DbContextOptions<Conexion> options) : base(options) { }
    public DbSet<Alerta> alerta { get; set; }
    public DbSet<Campaña> campaña { get; set; }
    public DbSet<CentroSalud> centrosalud { get; set; }
    public DbSet<GrupoPriorizado> grupopriorizado { get; set; }
    public DbSet<Indicador> indicador { get; set; }
    public DbSet<Jornada> jornada { get; set; }
    public DbSet<Lote> lote { get; set; }
    public DbSet<MovimientoStock> movimientostock { get; set; }
    public DbSet<Paciente> paciente { get; set; }
    public DbSet<PoblacionObjetivo> poblacionobjetivo { get; set; }
    public DbSet<PuntoVacunacion> puntovacunacion { get; set; }
    public DbSet<Reporte> reporte { get; set; }
    public DbSet<Rol> rol { get; set; }
    public DbSet<Usuario> usuario { get; set; }
    public DbSet<Vacuna> vacuna { get; set; }
    public DbSet<Vacunacion> vacunacion { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alerta>().HasKey(x => x.IdAlerta);
        modelBuilder.Entity<Campaña>().HasKey(x => x.IdCampaña);
        modelBuilder.Entity<CentroSalud>().HasKey(x => x.IdCentro);
        modelBuilder.Entity<GrupoPriorizado>().HasKey(x => x.IdGrupo);
        modelBuilder.Entity<Indicador>().HasKey(x => x.IdIndicador);
        modelBuilder.Entity<Jornada>().HasKey(x => x.IdJornada);
        modelBuilder.Entity<Lote>().HasKey(x => x.IdLote);
        modelBuilder.Entity<MovimientoStock>().HasKey(x => x.IdMovimiento);
        modelBuilder.Entity<Paciente>().HasKey(x => x.IdPaciente);
        modelBuilder.Entity<PoblacionObjetivo>().HasKey(x => x.IdPoblacion);
        modelBuilder.Entity<PuntoVacunacion>().HasKey(x => x.IdPunto);
        modelBuilder.Entity<Reporte>().HasKey(x => x.IdReporte);
        modelBuilder.Entity<Rol>().HasKey(x => x.IdRol);
        modelBuilder.Entity<Usuario>().HasKey(x => x.IdUsuario);
        modelBuilder.Entity<Vacuna>().HasKey(x => x.IdVacuna);
        modelBuilder.Entity<Vacunacion>().HasKey(x => x.IdVacunacion);

        modelBuilder.Entity<Usuario>().HasOne(x => x.Rol).WithMany(x => x.Usuarios).HasForeignKey(x => x.IdRol);
        modelBuilder.Entity<Campaña>().HasOne(x => x.CentroSalud).WithMany(x => x.Campañas).HasForeignKey(x => x.IdCentro);
        modelBuilder.Entity<Campaña>().HasMany(x => x.Poblaciones).WithOne(x => x.Campaña).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<Campaña>().HasMany(x => x.Vacunaciones).WithOne(x => x.Campaña).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<Campaña>().HasMany<Indicador>().WithOne(x => x.Campaña).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<Campaña>().HasMany<Jornada>().WithOne(x => x.Campaña).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<Campaña>().HasMany<Reporte>().WithOne(x => x.Campaña).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<PoblacionObjetivo>().HasOne(x => x.Campaña).WithMany(x => x.Poblaciones).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<PoblacionObjetivo>().HasMany(x => x.Grupos).WithOne(x => x.PoblacionObjetivo).HasForeignKey(x => x.IdPoblacion);
        modelBuilder.Entity<GrupoPriorizado>().HasOne(x => x.PoblacionObjetivo).WithMany(x => x.Grupos).HasForeignKey(x => x.IdPoblacion);
        modelBuilder.Entity<Paciente>().HasOne(x => x.GrupoPriorizado).WithMany().HasForeignKey(x => x.IdGrupo);
        modelBuilder.Entity<Lote>().HasOne(x => x.Vacuna).WithMany(x => x.Lotes).HasForeignKey(x => x.IdVacuna);
        modelBuilder.Entity<Alerta>().HasOne(x => x.Lote).WithMany().HasForeignKey(x => x.IdLote);
        modelBuilder.Entity<MovimientoStock>().HasOne(x => x.Lote).WithMany().HasForeignKey(x => x.IdLote);
        modelBuilder.Entity<Jornada>().HasOne(x => x.Campaña).WithMany().HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<PuntoVacunacion>().HasOne(x => x.Jornada).WithMany(x => x.Puntos).HasForeignKey(x => x.IdJornada);
        modelBuilder.Entity<Jornada>().HasMany(j => j.Implicados).WithMany(u => u.Jornadas).UsingEntity(j => j.ToTable("JornadaUsuarios"));
        modelBuilder.Entity<Vacunacion>().HasOne(x => x.Paciente).WithMany().HasForeignKey(x => x.IdPaciente);
        modelBuilder.Entity<Vacunacion>().HasOne(x => x.Campaña).WithMany(x => x.Vacunaciones).HasForeignKey(x => x.IdCampaña);
        modelBuilder.Entity<Vacunacion>().HasOne(x => x.Lote).WithMany().HasForeignKey(x => x.IdLote);
        modelBuilder.Entity<Vacunacion>().HasOne(x => x.PuntoVacunacion).WithMany().HasForeignKey(x => x.IdPunto);
        modelBuilder.Entity<Vacunacion>().HasOne(x => x.UsuarioAplicador).WithMany().HasForeignKey(x => x.IdUsuarioAplicador);

        modelBuilder.Entity<Alerta>().ToTable("Alertas");
        modelBuilder.Entity<Campaña>().ToTable("Campañas");
        modelBuilder.Entity<CentroSalud>().ToTable("CentrosSalud");
        modelBuilder.Entity<GrupoPriorizado>().ToTable("GruposPriorizados");
        modelBuilder.Entity<Indicador>().ToTable("Indicadores");
        modelBuilder.Entity<Jornada>().ToTable("Jornadas");
        modelBuilder.Entity<Lote>().ToTable("Lotes");
        modelBuilder.Entity<MovimientoStock>().ToTable("MovimientosStock");
        modelBuilder.Entity<Paciente>().ToTable("Pacientes");
        modelBuilder.Entity<PoblacionObjetivo>().ToTable("PoblacionObjetivo");
        modelBuilder.Entity<PuntoVacunacion>().ToTable("PuntosVacunacion");
        modelBuilder.Entity<Reporte>().ToTable("Reportes");
        modelBuilder.Entity<Rol>().ToTable("Roles");
        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Vacuna>().ToTable("Vacunas");
        modelBuilder.Entity<Vacunacion>().ToTable("Vacunaciones");
    }
}