using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GruposPriorizadosController : ControllerBase
    {
        private readonly Conexion _context;

        public GruposPriorizadosController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetGrupos()
        {
            var grupos = _context.grupopriorizado.ToList();
            return Ok(grupos);
        }

        [HttpGet("{id}")]
        public IActionResult GetGrupo(int id)
        {
            var grupo = _context.grupopriorizado.Find(id);
            if (grupo == null) return NotFound();
            return Ok(grupo);
        }

        [HttpPost]
        public IActionResult CreateGrupo([FromBody] GrupoPriorizado grupo)
        {
            _context.grupopriorizado.Add(grupo);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetGrupo), new { id = grupo.IdGrupo }, grupo);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateGrupo(int id, [FromBody] GrupoPriorizado grupo)
        {
            var existing = _context.grupopriorizado.Find(id);
            if (existing == null) return NotFound();

            existing.NombreGrupo = grupo.NombreGrupo;
            existing.IdPoblacion = grupo.IdPoblacion;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteGrupo(int id)
        {
            var grupo = _context.grupopriorizado.Find(id);
            if (grupo == null) return NotFound();

            _context.grupopriorizado.Remove(grupo);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
