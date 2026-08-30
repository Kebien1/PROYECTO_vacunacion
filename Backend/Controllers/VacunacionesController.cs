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
            var vacunaciones = _context.vacunacion
                .Include(v => v.Paciente)
                    .ThenInclude(p => p.GrupoPriorizado)
                .Include(v => v.Lote)
                    .ThenInclude(l => l.Vacuna)
                .Include(v => v.Campaña)
                .Include(v => v.PuntoVacunacion)
                .Include(v => v.UsuarioAplicador)
                .ToList();
            return Ok(vacunaciones);
        }

        [HttpGet("{id}")]
        public IActionResult GetVacunacion(int id)
        {
            var vacunacion = _context.vacunacion
                .Include(v => v.Paciente)
                .Include(v => v.Lote).ThenInclude(l => l.Vacuna)
                .Include(v => v.PuntoVacunacion)
                .Include(v => v.UsuarioAplicador)
                .FirstOrDefault(v => v.IdVacunacion == id);
            if (vacunacion == null) return NotFound();
            return Ok(vacunacion);
        }

        [HttpPost]
        public IActionResult CreateVacunacion([FromBody] Vacunacion vacunacion)
        {
            // Validar paciente
            if (!_context.paciente.Any(p => p.IdPaciente == vacunacion.IdPaciente))
                return BadRequest(new { mensaje = "El paciente no existe" });

            // Validar lote y stock
            var lote = _context.lote.Find(vacunacion.IdLote);
            if (lote == null || lote.CantidadDisponible < 1)
                return BadRequest(new { mensaje = "El lote no existe o no tiene stock disponible" });

            // Validar campaña
            if (!_context.campaña.Any(c => c.IdCampaña == vacunacion.IdCampaña))
                return BadRequest(new { mensaje = "La campaña no existe" });

            // Validar usuario aplicador
            if (!_context.usuario.Any(u => u.IdUsuario == vacunacion.IdUsuarioAplicador))
                return BadRequest(new { mensaje = "El usuario aplicador no existe" });

            // Validar punto de vacunación (opcional)
            if (vacunacion.IdPunto != null && !_context.puntovacunacion.Any(p => p.IdPunto == vacunacion.IdPunto))
                return BadRequest(new { mensaje = "El punto de vacunación no existe" });

            // Descontar stock
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
            existing.IdPaciente = vacunacion.IdPaciente;
            existing.IdCampaña = vacunacion.IdCampaña;
            existing.IdLote = vacunacion.IdLote;
            existing.IdPunto = vacunacion.IdPunto;
            existing.IdUsuarioAplicador = vacunacion.IdUsuarioAplicador;

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
