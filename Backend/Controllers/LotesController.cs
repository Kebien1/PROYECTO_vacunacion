using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        private readonly Conexion _context;

        public LotesController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetLotes()
        {
            var lotes = _context.lote.Include(l => l.Vacuna).ToList();
            return Ok(lotes);
        }

        [HttpGet("{id}")]
        public IActionResult GetLote(int id)
        {
            var lote = _context.lote.Include(l => l.Vacuna).FirstOrDefault(l => l.IdLote == id);
            if (lote == null) return NotFound();
            return Ok(lote);
        }

        [HttpPost]
        public IActionResult CreateLote([FromBody] Lote lote)
        {
            if (!_context.vacuna.Any(v => v.IdVacuna == lote.IdVacuna))
                return BadRequest(new { mensaje = "La vacuna seleccionada no existe" });
            lote.Vacuna = null;
            _context.lote.Add(lote);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetLote), new { id = lote.IdLote }, lote);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateLote(int id, [FromBody] Lote lote)
        {
            var existing = _context.lote.Find(id);
            if (existing == null) return NotFound();

            existing.NombreVacuna = lote.NombreVacuna;
            existing.CantidadDisponible = lote.CantidadDisponible;
            existing.FechaVencimiento = lote.FechaVencimiento;
            existing.IdVacuna = lote.IdVacuna;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteLote(int id)
        {
            var lote = _context.lote.Find(id);
            if (lote == null) return NotFound();

            _context.lote.Remove(lote);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
