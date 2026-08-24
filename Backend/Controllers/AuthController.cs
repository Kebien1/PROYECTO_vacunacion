using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly Conexion _context;

    public AuthController(Conexion context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var usuario = _context.usuario
            .Include(u => u.Rol)
            .FirstOrDefault(u => u.Correo == request.Usuario && u.Contraseña == request.Password);

        if (usuario == null) return Unauthorized(new { mensaje = "Credenciales incorrectas" });

        return Ok(new
        {
            token = usuario.IdUsuario.ToString(),
            usuario = usuario.Correo,
            nombre = usuario.Nombre,
            rol = usuario.Rol?.NombreRol ?? "Sin rol"
        });
    }
}

public record LoginRequest(string Usuario, string Password);