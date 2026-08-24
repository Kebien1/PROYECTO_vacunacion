using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly Conexion _context;

        public ReportesController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetReportes()
        {
            var reportes = _context.reporte.Include(r => r.Campaña).ToList();
            return Ok(reportes);
        }

        [HttpGet("{id}")]
        public IActionResult GetReporte(int id)
        {
            var reporte = _context.reporte.Include(r => r.Campaña).FirstOrDefault(r => r.IdReporte == id);
            if (reporte == null) return NotFound();
            return Ok(reporte);
        }

        [HttpPost]
        public IActionResult CreateReporte([FromBody] Reporte reporte)
        {
            _context.reporte.Add(reporte);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetReporte), new { id = reporte.IdReporte }, reporte);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateReporte(int id, [FromBody] Reporte reporte)
        {
            var existing = _context.reporte.Find(id);
            if (existing == null) return NotFound();

            existing.Cobertura = reporte.Cobertura;
            existing.PoblacionPendiente = reporte.PoblacionPendiente;
            existing.FechaGeneracion = reporte.FechaGeneracion;
            existing.IdCampaña = reporte.IdCampaña;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteReporte(int id)
        {
            var reporte = _context.reporte.Find(id);
            if (reporte == null) return NotFound();

            _context.reporte.Remove(reporte);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
