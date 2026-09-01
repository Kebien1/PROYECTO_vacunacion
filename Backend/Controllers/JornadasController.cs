using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    public class JornadaDto
    {
        public DateTime Fecha { get; set; }
        public int IdCampaña { get; set; }
        public List<int> ImplicadosIds { get; set; } = new List<int>();
    }

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
            var jornadas = _context.jornada
                .Include(j => j.Campaña)
                .Include(j => j.Implicados)
                .ToList();
            
            // To prevent JSON cycles, we can select an anonymous object or just let JSON ignoring cycles handle it
            // Assuming the project has ReferenceHandler.IgnoreCycles configured.
            return Ok(jornadas);
        }

        [HttpGet("{id}")]
        public IActionResult GetJornada(int id)
        {
            var jornada = _context.jornada
                .Include(j => j.Campaña)
                .Include(j => j.Implicados)
                .FirstOrDefault(j => j.IdJornada == id);
            if (jornada == null) return NotFound();
            return Ok(jornada);
        }

        [HttpPost]
        public IActionResult CreateJornada([FromBody] JornadaDto dto)
        {
            var jornada = new Jornada 
            {
                Fecha = dto.Fecha,
                IdCampaña = dto.IdCampaña
            };

            if (dto.ImplicadosIds != null && dto.ImplicadosIds.Any())
            {
                var implicados = _context.usuario.Where(u => dto.ImplicadosIds.Contains(u.IdUsuario)).ToList();
                jornada.Implicados = implicados;
            }

            _context.jornada.Add(jornada);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetJornada), new { id = jornada.IdJornada }, jornada);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJornada(int id, [FromBody] JornadaDto dto)
        {
            var existing = _context.jornada.Include(j => j.Implicados).FirstOrDefault(j => j.IdJornada == id);
            if (existing == null) return NotFound();

            existing.Fecha = dto.Fecha;
            existing.IdCampaña = dto.IdCampaña;

            if (dto.ImplicadosIds != null)
            {
                var implicados = _context.usuario.Where(u => dto.ImplicadosIds.Contains(u.IdUsuario)).ToList();
                existing.Implicados = implicados;
            }

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
