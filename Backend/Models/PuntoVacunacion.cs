using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class PuntoVacunacion
{
    public int IdPunto { get; set; }
    public string Nombre { get; set; }
    public string Direccion { get; set; }

    public int IdJornada { get; set; }
    public Jornada? Jornada { get; set; }
}