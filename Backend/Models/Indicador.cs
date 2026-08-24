using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Indicador
{
    public int IdIndicador { get; set; }
    public string NombreIndicador { get; set; }
    public decimal Valor { get; set; }

    public int IdCampaña { get; set; }
    public Campaña? Campaña { get; set; }
}