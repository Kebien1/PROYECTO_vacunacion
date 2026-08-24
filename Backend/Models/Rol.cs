using Microsoft.EntityFrameworkCore;
namespace Backend.Models;

public class Rol
{
    public int IdRol { get; set; }
    public string NombreRol { get; set; }

    // Relación con Usuarios
    public ICollection<Usuario>? Usuarios { get; set; }
}