using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuntosVacunacionController : ControllerBase
    {
        private readonly Conexion _context;

        public PuntosVacunacionController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPuntos()
        {
            var puntos = _context.puntovacunacion.Include(p => p.Jornada).ToList();
            return Ok(puntos);
        }

        [HttpGet("{id}")]
        public IActionResult GetPunto(int id)
        {
            var punto = _context.puntovacunacion.Include(p => p.Jornada).FirstOrDefault(p => p.IdPunto == id);
            if (punto == null) return NotFound();
            return Ok(punto);
        }

        [HttpPost]
        public IActionResult CreatePunto([FromBody] PuntoVacunacion punto)
        {
            _context.puntovacunacion.Add(punto);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPunto), new { id = punto.IdPunto }, punto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePunto(int id, [FromBody] PuntoVacunacion punto)
        {
            var existing = _context.puntovacunacion.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = punto.Nombre;
            existing.Direccion = punto.Direccion;
            existing.IdJornada = punto.IdJornada;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePunto(int id)
        {
            var punto = _context.puntovacunacion.Find(id);
            if (punto == null) return NotFound();

            _context.puntovacunacion.Remove(punto);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
