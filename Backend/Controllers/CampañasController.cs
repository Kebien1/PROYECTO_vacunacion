using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampañasController : ControllerBase
    {
        private readonly Conexion _context;

        public CampañasController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCampañas()
        {
            var campañas = _context.campaña.ToList();
            return Ok(campañas);
        }

        [HttpGet("{id}")]
        public IActionResult GetCampaña(int id)
        {
            var campaña = _context.campaña.Find(id);
            if (campaña == null) return NotFound();
            return Ok(campaña);
        }

        [HttpPost]
        public IActionResult CreateCampaña([FromBody] Campaña campaña)
        {
            _context.campaña.Add(campaña);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCampaña), new { id = campaña.IdCampaña }, campaña);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCampaña(int id, [FromBody] Campaña campaña)
        {
            var existing = _context.campaña.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = campaña.Nombre;
            existing.FechaInicio = campaña.FechaInicio;
            existing.FechaFin = campaña.FechaFin;
            existing.IdCentro = campaña.IdCentro;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCampaña(int id)
        {
            var campaña = _context.campaña.Find(id);
            if (campaña == null) return NotFound();

            _context.campaña.Remove(campaña);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
