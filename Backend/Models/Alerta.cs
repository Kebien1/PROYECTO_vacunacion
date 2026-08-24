using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Alerta
{
    public int IdAlerta { get; set; }
    public string TipoAlerta { get; set; }
    public DateTime FechaGenerada { get; set; }

    public int IdLote { get; set; }
    public Lote? Lote { get; set; }
}