using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Reporte
{
    public int IdReporte { get; set; }
    public decimal Cobertura { get; set; }
    public int PoblacionPendiente { get; set; }
    public DateTime FechaGeneracion { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }
}