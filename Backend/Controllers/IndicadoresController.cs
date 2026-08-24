using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndicadoresController : ControllerBase
    {
        private readonly Conexion _context;

        public IndicadoresController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetIndicadores()
        {
            var indicadores = _context.indicador.Include(i => i.Campaña).ToList();
            return Ok(indicadores);
        }

        [HttpGet("{id}")]
        public IActionResult GetIndicador(int id)
        {
            var indicador = _context.indicador.Include(i => i.Campaña).FirstOrDefault(i => i.IdIndicador == id);
            if (indicador == null) return NotFound();
            return Ok(indicador);
        }

        [HttpPost]
        public IActionResult CreateIndicador([FromBody] Indicador indicador)
        {
            _context.indicador.Add(indicador);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetIndicador), new { id = indicador.IdIndicador }, indicador);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateIndicador(int id, [FromBody] Indicador indicador)
        {
            var existing = _context.indicador.Find(id);
            if (existing == null) return NotFound();

            existing.NombreIndicador = indicador.NombreIndicador;
            existing.Valor = indicador.Valor;
            existing.IdCampaña = indicador.IdCampaña;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteIndicador(int id)
        {
            var indicador = _context.indicador.Find(id);
            if (indicador == null) return NotFound();

            _context.indicador.Remove(indicador);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
