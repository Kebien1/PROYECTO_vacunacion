using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Vacunacion
{
    public int IdVacunacion { get; set; }
    public DateTime FechaAplicacion { get; set; }
    public string Dosis { get; set; }

    public int IdPaciente { get; set; }
    public Paciente? Paciente { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }

    public int IdLote { get; set; }
    public Lote? Lote { get; set; }

    public int? IdPunto { get; set; }
    public PuntoVacunacion? PuntoVacunacion { get; set; }

    public int IdUsuarioAplicador { get; set; }
    public Usuario? UsuarioAplicador { get; set; }
}