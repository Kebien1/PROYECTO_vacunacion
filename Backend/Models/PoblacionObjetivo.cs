using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class PoblacionObjetivo
{
    public int IdPoblacion { get; set; }
    public string Descripcion { get; set; }
    public int EdadMin { get; set; }
    public int EdadMax { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }

    public ICollection<GrupoPriorizado>? Grupos { get; set; }
}