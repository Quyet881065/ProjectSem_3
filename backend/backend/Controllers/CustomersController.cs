using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly WebflowerContext _flowerContext;
        public CustomersController(WebflowerContext flowerContext) 
        { 
           _flowerContext = flowerContext;
        }

        // Get all customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _flowerContext.Customers.ToListAsync();
            return Ok(customers);
        }
        // Get customer by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _flowerContext.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return customer;
        }

        // Update customer details
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if(id != customer.CustomerId)
            {
                return BadRequest();
            }
            _flowerContext.Entry(customer).State = EntityState.Modified;
            try
            {
                await _flowerContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
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

        // Delete a customer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _flowerContext.Customers.FindAsync(id);
            if(customer == null)
            {
                return NotFound();
            }
            _flowerContext.Remove(customer);
            await _flowerContext.SaveChangesAsync();
            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _flowerContext.Customers.Any(e => e.CustomerId == id);
        }
    }
}
