using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class CentroSalud
{
    public int IdCentro { get; set; }
    public string Nombre { get; set; }
    public string Direccion { get; set; }

    public ICollection<Campaña>? Campañas { get; set; }
}