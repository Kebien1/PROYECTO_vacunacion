using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Usuario
{

    public int IdUsuario { get; set; }
    public string Nombre { get; set; }
    public string Correo { get; set; }
    public string Contraseña { get; set; }

    // Relaciones
    public int IdRol { get; set; }
    public Rol? Rol { get; set; }

    public ICollection<Jornada>? Jornadas { get; set; } = new List<Jornada>();
}