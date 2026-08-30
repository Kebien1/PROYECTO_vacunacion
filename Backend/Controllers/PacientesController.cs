using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly Conexion _context;

        public PacientesController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPacientes()
        {
            var pacientes = _context.paciente
                .Include(p => p.GrupoPriorizado)
                .ToList();
            return Ok(pacientes);
        }

        [HttpGet("{id}")]
        public IActionResult GetPaciente(int id)
        {
            var paciente = _context.paciente
                .Include(p => p.GrupoPriorizado)
                .FirstOrDefault(p => p.IdPaciente == id);
            if (paciente == null) return NotFound();
            return Ok(paciente);
        }

        [HttpGet("buscar/{cedula}")]
        public IActionResult BuscarPorCedula(string cedula)
        {
            var paciente = _context.paciente
                .Include(p => p.GrupoPriorizado)
                .FirstOrDefault(p => p.Cedula == cedula);
            if (paciente == null) return NotFound(new { mensaje = "Paciente no encontrado" });
            return Ok(paciente);
        }

        [HttpPost]
        public IActionResult CreatePaciente([FromBody] Paciente paciente)
        {
            if (_context.paciente.Any(p => p.Cedula == paciente.Cedula))
                return BadRequest(new { mensaje = "Ya existe un paciente con esa cédula" });

            _context.paciente.Add(paciente);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPaciente), new { id = paciente.IdPaciente }, paciente);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePaciente(int id, [FromBody] Paciente paciente)
        {
            var existing = _context.paciente.Find(id);
            if (existing == null) return NotFound();

            existing.Nombre = paciente.Nombre;
            existing.Cedula = paciente.Cedula;
            existing.FechaNacimiento = paciente.FechaNacimiento;
            existing.Sexo = paciente.Sexo;
            existing.IdGrupo = paciente.IdGrupo;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePaciente(int id)
        {
            var paciente = _context.paciente.Find(id);
            if (paciente == null) return NotFound();

            _context.paciente.Remove(paciente);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
