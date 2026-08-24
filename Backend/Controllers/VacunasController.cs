using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VacunasController : ControllerBase
{
    private readonly Conexion _context;

    public VacunasController(Conexion context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetVacunas() => Ok(_context.vacuna.ToList());

    [HttpPost]
    public IActionResult CreateVacuna([FromBody] Vacuna vacuna)
    {
        _context.vacuna.Add(vacuna);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetVacuna), new { id = vacuna.IdVacuna }, vacuna);
    }

    [HttpGet("{id}")]
    public IActionResult GetVacuna(int id)
    {
        var vacuna = _context.vacuna.Find(id);
        return vacuna == null ? NotFound() : Ok(vacuna);
    }
}