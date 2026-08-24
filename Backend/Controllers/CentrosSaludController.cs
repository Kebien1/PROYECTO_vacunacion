using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CentrosSaludController : ControllerBase
    {
        private readonly Conexion _context;

        public CentrosSaludController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCentros()
        {
            var centros = _context.centrosalud.ToList();
            return Ok(centros);
        }

        [HttpGet("{id}")]
        public IActionResult GetCentro(int id)
        {
            var centro = _context.centrosalud.Find(id);
            if (centro == null) return NotFound();
            return Ok(centro);
        }

        [HttpPost]
        public IActionResult CreateCentro([FromBody] CentroSalud centro)
        {
            _context.centrosalud.Add(centro);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCentro), new { id = centro.IdCentro }, centro);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCentro(int id, [FromBody] CentroSalud centro)
        {
            var existing = _context.centrosalud.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = centro.Nombre;
            existing.Direccion = centro.Direccion;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCentro(int id)
        {
            var centro = _context.centrosalud.Find(id);
            if (centro == null) return NotFound();

            _context.centrosalud.Remove(centro);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
