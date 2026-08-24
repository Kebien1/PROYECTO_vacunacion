using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Campaña
{
    public int IdCampaña { get; set; }
    public string Nombre { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }

    public int IdCentro { get; set; }
    public CentroSalud? CentroSalud { get; set; }

    public ICollection<PoblacionObjetivo>? Poblaciones { get; set; }
    public ICollection<Vacunacion>? Vacunaciones { get; set; }
}