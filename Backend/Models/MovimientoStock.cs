using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class MovimientoStock
{
    public int IdMovimiento { get; set; }
    public string TipoMovimiento { get; set; } // Entrada / Salida
    public int Cantidad { get; set; }
    public DateTime FechaMovimiento { get; set; }

    public int IdLote { get; set; }
    public Lote? Lote { get; set; }
}