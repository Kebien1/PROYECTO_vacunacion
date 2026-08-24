using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JornadasController : ControllerBase
    {
        private readonly Conexion _context;

        public JornadasController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetJornadas()
        {
            var jornadas = _context.jornada.Include(j => j.Campaña).ToList();
            return Ok(jornadas);
        }

        [HttpGet("{id}")]
        public IActionResult GetJornada(int id)
        {
            var jornada = _context.jornada.Include(j => j.Campaña).FirstOrDefault(j => j.IdJornada == id);
            if (jornada == null) return NotFound();
            return Ok(jornada);
        }

        [HttpPost]
        public IActionResult CreateJornada([FromBody] Jornada jornada)
        {
            _context.jornada.Add(jornada);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetJornada), new { id = jornada.IdJornada }, jornada);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJornada(int id, [FromBody] Jornada jornada)
        {
            var existing = _context.jornada.Find(id);
            if (existing == null) return NotFound();

            existing.Fecha = jornada.Fecha;
            existing.IdCampaña = jornada.IdCampaña;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJornada(int id)
        {
            var jornada = _context.jornada.Find(id);
            if (jornada == null) return NotFound();

            _context.jornada.Remove(jornada);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
