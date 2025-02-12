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
    public class CartsController : ControllerBase
    {
        private readonly WebflowerContext _context;

        public CartsController(WebflowerContext context)
        {
            _context = context;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCarts()
        {
            return await _context.Carts.ToListAsync();
        }

        // GET: api/Carts/5
        // Get all cart items for a user
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartItems(int userId)
        {
            // Lấy URL cơ sở (base URL) của request
            //var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            var cartItems = await _context.Carts
        .Include(c => c.Flower) // Including only necessary properties
        .Where(c => c.UserId == userId)
        .Select(c => new
        {
            c.CartId,
            c.Quantity,
            Flower = new
            {
                c.Flower.FlowerId,
                c.Flower.FlowerName,
                c.Flower.Price,
               c.Flower.Image
            }
        })
        .ToListAsync();

            if (cartItems == null)
            {
                return NotFound();
            }

            return Ok(new { success = true, cartData = cartItems });
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutCart(List<Cart> updatedCartItems)
        {
            // If the list is empty, return BadRequest
            if (updatedCartItems == null || updatedCartItems.Count == 0)
            {
                return BadRequest("No cart items provided.");
            }

            foreach (var cart in updatedCartItems)
            {
                var existingCartItem = await _context.Carts
                    .FirstOrDefaultAsync(c => c.CartId == cart.CartId);

                if (existingCartItem == null)
                {
                    return NotFound($"Cart item with ID {cart.CartId} not found.");
                }

                // Handle quantity of 0 (removal of item)
                if (cart.Quantity == 0)
                {
                    _context.Carts.Remove(existingCartItem);  // Remove the cart item if quantity is 0
                }
                else
                {
                    // Update the cart item if quantity > 0
                    existingCartItem.Quantity = cart.Quantity;
                    _context.Entry(existingCartItem).State = EntityState.Modified;
                }
            }

            try
            {
                await _context.SaveChangesAsync(); // Save all changes in one transaction
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the cart.");
            }

            return NoContent(); // Return 204 No Content if everything is successful
        }


        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // Add an item to cart
        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] Cart cartItem)
        {
            // Check if the item already exists in the user's cart
            var existingItem = await _context.Carts
                .Where(c => c.UserId == cartItem.UserId && c.FlowerId == cartItem.FlowerId)
                .FirstOrDefaultAsync();

            if (existingItem != null)
            {
                // If it exists, update the quantity
                existingItem.Quantity += cartItem.Quantity;
                _context.Entry(existingItem).State = EntityState.Modified;
            }
            else
            {
                // Add a new item to the cart
                cartItem.DateAdded = DateTime.Now;
                _context.Carts.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null)
            {
                return NotFound();
            }

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("ClearCart/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            // Find all items in the user's cart
            var cartItems = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            if(cartItems == null || cartItems.Count == 0)
            {
                return NotFound("No items found in the cart");
            }
            // Remove all items from the user's cart
            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.CartId == id);
        }
    }
}
