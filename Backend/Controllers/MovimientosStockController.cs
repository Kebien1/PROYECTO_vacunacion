using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosStockController : ControllerBase
    {
        private readonly Conexion _context;

        public MovimientosStockController(Conexion context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMovimientos()
        {
            var movimientos = _context.movimientostock.Include(m => m.Lote).ToList();
            return Ok(movimientos);
        }

        [HttpGet("{id}")]
        public IActionResult GetMovimiento(int id)
        {
            var movimiento = _context.movimientostock.Include(m => m.Lote).FirstOrDefault(m => m.IdMovimiento == id);
            if (movimiento == null) return NotFound();
            return Ok(movimiento);
        }

        [HttpPost]
        public IActionResult CreateMovimiento([FromBody] MovimientoStock movimiento)
        {
            _context.movimientostock.Add(movimiento);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetMovimiento), new { id = movimiento.IdMovimiento }, movimiento);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMovimiento(int id, [FromBody] MovimientoStock movimiento)
        {
            var existing = _context.movimientostock.Find(id);
            if (existing == null) return NotFound();

            existing.TipoMovimiento = movimiento.TipoMovimiento;
            existing.Cantidad = movimiento.Cantidad;
            existing.FechaMovimiento = movimiento.FechaMovimiento;
            existing.IdLote = movimiento.IdLote;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMovimiento(int id)
        {
            var movimiento = _context.movimientostock.Find(id);
            if (movimiento == null) return NotFound();

            _context.movimientostock.Remove(movimiento);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
