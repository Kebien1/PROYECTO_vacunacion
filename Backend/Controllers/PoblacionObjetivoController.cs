using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PoblacionObjetivoController : ControllerBase
{
    private readonly Conexion _context;

    public PoblacionObjetivoController(Conexion context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetPoblaciones() => Ok(_context.poblacionobjetivo.ToList());

    [HttpGet("{id}")]
    public IActionResult GetPoblacion(int id)
    {
        var poblacion = _context.poblacionobjetivo.Find(id);
        return poblacion == null ? NotFound() : Ok(poblacion);
    }

    [HttpPost]
    public IActionResult CreatePoblacion([FromBody] PoblacionObjetivo poblacion)
    {
        poblacion.Campaña = null!;
        poblacion.Grupos = null!;
        _context.poblacionobjetivo.Add(poblacion);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetPoblacion), new { id = poblacion.IdPoblacion }, poblacion);
    }
}