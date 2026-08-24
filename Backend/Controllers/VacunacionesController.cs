using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacunacionesController : ControllerBase
    {
        private readonly Conexion _context;

        public VacunacionesController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetVacunaciones()
        {
            var vacunaciones = _context.vacunacion.Include(v => v.Usuario).Include(v => v.Lote).ThenInclude(l => l.Vacuna).ToList();
            return Ok(vacunaciones);
        }

        [HttpGet("{id}")]
        public IActionResult GetVacunacion(int id)
        {
            var vacunacion = _context.vacunacion.Find(id);
            if (vacunacion == null) return NotFound();
            return Ok(vacunacion);
        }

        [HttpPost]
        public IActionResult CreateVacunacion([FromBody] Vacunacion vacunacion)
        {
            var lote = _context.lote.Find(vacunacion.IdLote);
            if (lote == null || lote.CantidadDisponible < 1)
                return BadRequest(new { mensaje = "El lote no existe o no tiene stock disponible" });
            if (!_context.usuario.Any(u => u.IdUsuario == vacunacion.IdUsuario) || !_context.campaña.Any(c => c.IdCampaña == vacunacion.IdCampaña))
                return BadRequest(new { mensaje = "Usuario o campaña inválidos" });
            lote.CantidadDisponible--;
            _context.vacunacion.Add(vacunacion);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetVacunacion), new { id = vacunacion.IdVacunacion }, vacunacion);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVacunacion(int id, [FromBody] Vacunacion vacunacion)
        {
            var existing = _context.vacunacion.Find(id);
            if (existing == null) return NotFound();

            var newLote = _context.lote.Find(vacunacion.IdLote);
            if (newLote == null) return BadRequest(new { mensaje = "El lote no existe" });
            if (existing.IdLote != vacunacion.IdLote)
            {
                var oldLote = _context.lote.Find(existing.IdLote);
                if (oldLote != null) oldLote.CantidadDisponible++;
                if (newLote.CantidadDisponible < 1) return BadRequest(new { mensaje = "El nuevo lote no tiene stock" });
                newLote.CantidadDisponible--;
            }

            existing.FechaAplicacion = vacunacion.FechaAplicacion;
            existing.Dosis = vacunacion.Dosis;
            existing.IdUsuario = vacunacion.IdUsuario;
            existing.IdCampaña = vacunacion.IdCampaña;
            existing.IdLote = vacunacion.IdLote;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteVacunacion(int id)
        {
            var vacunacion = _context.vacunacion.Find(id);
            if (vacunacion == null) return NotFound();

            var lote = _context.lote.Find(vacunacion.IdLote);
            if (lote != null) lote.CantidadDisponible++;
            _context.vacunacion.Remove(vacunacion);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
