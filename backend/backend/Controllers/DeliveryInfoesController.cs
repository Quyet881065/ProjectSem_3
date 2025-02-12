using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryInfoesController : ControllerBase
    {
        private readonly WebflowerContext _context;

        public DeliveryInfoesController(WebflowerContext context)
        {
            _context = context;
        }

        // GET: api/DeliveryInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryInfo>>> GetDeliveryInfos()
        {
            return await _context.DeliveryInfos.ToListAsync();
        }

        // GET: api/DeliveryInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryInfo>> GetDeliveryInfo(int id)
        {
            var deliveryInfo = await _context.DeliveryInfos.FindAsync(id);

            if (deliveryInfo == null)
            {
                return NotFound();
            }

            return deliveryInfo;
        }

        // PUT: api/DeliveryInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeliveryInfo(int id, DeliveryInfo deliveryInfo)
        {
            if (id != deliveryInfo.Deliveryid)
            {
                return BadRequest();
            }

            _context.Entry(deliveryInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DeliveryInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DeliveryInfo>> PostDeliveryInfo(DeliveryInfo deliveryInfo)
        {
            _context.DeliveryInfos.Add(deliveryInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDeliveryInfo", new { id = deliveryInfo.Deliveryid }, deliveryInfo);
        }

        // DELETE: api/DeliveryInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryInfo(int id)
        {
            var deliveryInfo = await _context.DeliveryInfos.FindAsync(id);
            if (deliveryInfo == null)
            {
                return NotFound();
            }

            _context.DeliveryInfos.Remove(deliveryInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeliveryInfoExists(int id)
        {
            return _context.DeliveryInfos.Any(e => e.Deliveryid == id);
        }
    }
}
