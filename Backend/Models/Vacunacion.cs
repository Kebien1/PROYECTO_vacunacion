using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Vacunacion
{
    public int IdVacunacion { get; set; }
    public DateTime FechaAplicacion { get; set; }
    public string Dosis { get; set; }

    public int IdUsuario { get; set; }
    public Usuario? Usuario { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }

    public int IdLote { get; set; }
    public Lote? Lote { get; set; }
}