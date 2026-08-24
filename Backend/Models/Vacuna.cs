using Microsoft.EntityFrameworkCore;
namespace Backend.Models;
public class Vacuna
{
    public int IdVacuna { get; set; }
    public string Nombre { get; set; }
    public string Descripcion { get; set; }

    public ICollection<Lote> Lotes { get; set; }
}