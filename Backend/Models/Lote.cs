using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models;

public class Lote
{
    public int IdLote { get; set; }
    [NotMapped]
    public string? NombreVacuna { get; set; }
    public int CantidadDisponible { get; set; }
    public DateTime FechaVencimiento { get; set; }

    public int IdVacuna { get; set; }
    public Vacuna? Vacuna { get; set; }
}