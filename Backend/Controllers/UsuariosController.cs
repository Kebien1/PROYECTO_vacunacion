using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly Conexion _context;

        public UsuariosController(Conexion context)
        {
            _context = context;
        }

        // GET: api/usuarios
        [HttpGet]
        public IActionResult GetUsuarios()
        {
            var usuarios = _context.usuario.Include(u => u.Rol).ToList();
            return Ok(usuarios);
        }

        // GET: api/usuarios/5
        [HttpGet("{id}")]
        public IActionResult GetUsuario(int id)
        {
            var usuario = _context.usuario.Find(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        // POST: api/usuarios
        [HttpPost]
        public IActionResult CreateUsuario([FromBody] Usuario usuario)
        {
            if (_context.usuario.Any(u => u.Correo == usuario.Correo))
                return Conflict(new { mensaje = "El usuario ya existe" });

            if (!_context.rol.Any(r => r.IdRol == usuario.IdRol))
                return BadRequest(new { mensaje = "El rol seleccionado no existe" });

            usuario.Rol = null;
            _context.usuario.Add(usuario);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.IdUsuario }, usuario);
        }

        // PUT: api/usuarios/5
        [HttpPut("{id}")]
        public IActionResult UpdateUsuario(int id, [FromBody] Usuario usuario)
        {
            var existing = _context.usuario.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = usuario.Nombre;
            existing.Correo = usuario.Correo;
            existing.Contraseña = usuario.Contraseña;
            existing.IdRol = usuario.IdRol;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/usuarios/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUsuario(int id)
        {
            var usuario = _context.usuario.Find(id);
            if (usuario == null) return NotFound();

            _context.usuario.Remove(usuario);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
