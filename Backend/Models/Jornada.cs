using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Jornada
{
    public int IdJornada { get; set; }
    public DateTime Fecha { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }

    public ICollection<PuntoVacunacion>? Puntos { get; set; }
    
    public ICollection<Usuario>? Implicados { get; set; } = new List<Usuario>();
}