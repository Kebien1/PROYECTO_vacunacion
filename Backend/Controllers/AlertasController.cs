using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertasController : ControllerBase
    {
        private readonly Conexion _context;

        public AlertasController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAlertas()
        {
            var alertas = _context.alerta.Include(a => a.Lote).ToList();
            return Ok(alertas);
        }

        [HttpGet("{id}")]
        public IActionResult GetAlerta(int id)
        {
            var alerta = _context.alerta.Include(a => a.Lote).FirstOrDefault(a => a.IdAlerta == id);
            if (alerta == null) return NotFound();
            return Ok(alerta);
        }

        [HttpPost]
        public IActionResult CreateAlerta([FromBody] Alerta alerta)
        {
            _context.alerta.Add(alerta);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAlerta), new { id = alerta.IdAlerta }, alerta);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAlerta(int id, [FromBody] Alerta alerta)
        {
            var existing = _context.alerta.Find(id);
            if (existing == null) return NotFound();

            existing.TipoAlerta = alerta.TipoAlerta;
            existing.FechaGenerada = alerta.FechaGenerada;
            existing.IdLote = alerta.IdLote;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAlerta(int id)
        {
            var alerta = _context.alerta.Find(id);
            if (alerta == null) return NotFound();

            _context.alerta.Remove(alerta);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
