using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class GrupoPriorizado
{
    public int IdGrupo { get; set; }
    public string NombreGrupo { get; set; }

    public int IdPoblacion { get; set; }
    public PoblacionObjetivo? PoblacionObjetivo { get; set; }
}