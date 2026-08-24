using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly Conexion _context;

        public RolesController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {
            var roles = _context.rol.ToList();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public IActionResult GetRol(int id)
        {
            var rol = _context.rol.Find(id);
            if (rol == null) return NotFound();
            return Ok(rol);
        }

        [HttpPost]
        public IActionResult CreateRol([FromBody] Rol rol)
        {
            _context.rol.Add(rol);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetRol), new { id = rol.IdRol }, rol);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRol(int id, [FromBody] Rol rol)
        {
            var existing = _context.rol.Find(id);
            if (existing == null) return NotFound();

            existing.NombreRol = rol.NombreRol;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRol(int id)
        {
            var rol = _context.rol.Find(id);
            if (rol == null) return NotFound();

            _context.rol.Remove(rol);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
