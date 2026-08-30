using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Paciente
{
    public int IdPaciente { get; set; }
    public string Nombre { get; set; }
    public string Cedula { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string Sexo { get; set; }

    public int? IdGrupo { get; set; }
    public GrupoPriorizado? GrupoPriorizado { get; set; }
}
