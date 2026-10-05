import { useMemo, useState } from 'react';
import { products } from './products';
import { OWNER_WHATSAPP } from './config';

type Page = 'home' | 'products' | 'inquiry' | 'about' | 'contact';

type CartItem = {
  productId: string;
  quantity: number;
};

type CustomerForm = {
  name: string;
  mobile: string;
  area: string;
  message: string;
};

const money = (value: number) =>
  `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;

function App() {
  const [page, setPage] = useState<Page>('home');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('crackers-cart') || '[]');
    } catch {
      return [];
    }
  });

  const updateCart = (nextCart: CartItem[]) => {
    setCart(nextCart);
    localStorage.setItem('crackers-cart', JSON.stringify(nextCart));
  };

  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      updateCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      updateCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const changeQuantity = (productId: string, change: number) => {
    const nextCart = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(nextCart);
  };

  const removeFromCart = (productId: string) => {
    updateCart(cart.filter((item) => item.productId !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totals = useMemo(() => {
    let market = 0;
    let sale = 0;

    cart.forEach((item) => {
      const product = products.find(
        (entry) => entry.id === item.productId
      );

      if (!product) return;

      market += product.marketPrice * item.quantity;
      sale += product.salePrice * item.quantity;
    });

    return {
      market,
      sale,
      savings: market - sale,
    };
  }, [cart]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header
        page={page}
        navigate={navigate}
        cartCount={cartCount}
      />

      {page === 'home' && (
        <HomePage
          navigate={navigate}
          products={products}
          addToCart={addToCart}
        />
      )}

      {page === 'products' && (
        <ProductsPage
          products={products}
          addToCart={addToCart}
        />
      )}

      {page === 'inquiry' && (
        <InquiryPage
          cart={cart}
          products={products}
          totals={totals}
          changeQuantity={changeQuantity}
          removeFromCart={removeFromCart}
          navigate={navigate}
        />
      )}

      {page === 'about' && <AboutPage />}

      {page === 'contact' && <ContactPage />}

      <Footer navigate={navigate} />
    </div>
  );
}

/* =========================
   HEADER
========================= */

function Header({
  page,
  navigate,
  cartCount,
}: {
  page: Page;
  navigate: (page: Page) => void;
  cartCount: number;
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="brand"
          onClick={() => navigate('home')}
        >
          <span className="brand-icon">✦</span>
          <span>Sparkle Crackers</span>
        </button>

        <nav className="main-nav">
          <button
            className={page === 'home' ? 'active' : ''}
            onClick={() => navigate('home')}
          >
            Home
          </button>

          <button
            className={page === 'products' ? 'active' : ''}
            onClick={() => navigate('products')}
          >
            Products
          </button>

          <button
            className={page === 'about' ? 'active' : ''}
            onClick={() => navigate('about')}
          >
            About
          </button>

          <button
            className={page === 'contact' ? 'active' : ''}
            onClick={() => navigate('contact')}
          >
            Contact
          </button>
        </nav>

        <button
          className="inquiry-button"
          onClick={() => navigate('inquiry')}
        >
          🛒 Inquiry
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* =========================
   HOME
========================= */

function HomePage({
  navigate,
  products,
  addToCart,
}: {
  navigate: (page: Page) => void;
  products: typeof import('./products').products;
  addToCart: (id: string) => void;
}) {
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <p className="eyebrow">✨ Celebrate With Sparkle ✨</p>

            <h1>
              Light Up Your
              <span> Celebrations</span>
            </h1>

            <p>
              Discover quality crackers at special prices.
              Make every celebration bright, colorful and
              unforgettable.
            </p>

            <div className="hero-buttons">
              <button
                className="button primary"
                onClick={() => navigate('products')}
              >
                View Products
              </button>

              <button
                className="button ghost-light"
                onClick={() => navigate('inquiry')}
              >
                Make an Inquiry
              </button>
            </div>
          </div>

          <div className="hero-fireworks">
            <div className="firework">✦</div>
            <div className="firework second">✧</div>
            <div className="firework third">✦</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Our Collection</p>
            <h2>Featured Products</h2>
            <p>
              Choose your favorites and add them to your inquiry list.
            </p>
          </div>

          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>

          <div className="center-button">
            <button
              className="button primary"
              onClick={() => navigate('products')}
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================
   PRODUCTS
========================= */

function ProductsPage({
  products,
  addToCart,
}: {
  products: typeof import('./products').products;
  addToCart: (id: string) => void;
}) {
  const categories = [
    'All',
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <main>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Explore Our Collection</p>
          <h1>Our Products</h1>
          <p>
            Choose from our wide range of quality crackers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? 'category active'
                    : 'category'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================
   PRODUCT CARD
========================= */

function ProductCard({
  product,
  addToCart,
}: {
  product: (typeof import('./products').products)[number];
  addToCart: (id: string) => void;
}) {
  return (
    <article className="product-card">
      <div className="product-art">
        <span>✦</span>
        <small>{product.category}</small>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <div className="price-row">
          <div>
            <span className="price-label">Market Price</span>
            <span className="market-price">
              {money(product.marketPrice)}
            </span>
          </div>

          <div>
            <span className="price-label">Sale Price</span>
            <span className="sale-price">
              {money(product.salePrice)}
            </span>
          </div>
        </div>

        <div className="save-text">
          Save {money(product.marketPrice - product.salePrice)}
        </div>

        <button
          className="button primary full"
          onClick={() => addToCart(product.id)}
        >
          Add to Inquiry
        </button>
      </div>
    </article>
  );
}

/* =========================
   INQUIRY PAGE
========================= */

function InquiryPage({
  cart,
  products,
  totals,
  changeQuantity,
  removeFromCart,
  navigate,
}: {
  cart: CartItem[];
  products: typeof import('./products').products;
  totals: {
    market: number;
    sale: number;
    savings: number;
  };
  changeQuantity: (id: string, change: number) => void;
  removeFromCart: (id: string) => void;
  navigate: (page: Page) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <CustomerForm
        cart={cart}
        products={products}
        totals={totals}
        navigate={navigate}
      />
    );
  }

  return (
    <main>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Your Selection</p>
          <h1>Inquiry List</h1>
          <p>
            Review your selected products before sending your inquiry.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h2>Your inquiry list is empty</h2>
              <p>
                Add products from our collection to make an inquiry.
              </p>

              <button
                className="button primary"
                onClick={() => navigate('products')}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="inquiry-layout">
              <div className="inquiry-items">
                {cart.map((item) => {
                  const product = products.find(
                    (entry) => entry.id === item.productId
                  );

                  if (!product) return null;

                  const subtotal =
                    product.salePrice * item.quantity;

                  return (
                    <div
                      className="inquiry-item"
                      key={product.id}
                    >
                      <div className="inquiry-item-info">
                        <h3>{product.name}</h3>

                        <div className="inquiry-prices">
                          <span>
                            Market: {money(product.marketPrice)}
                          </span>

                          <span>
                            Sale: {money(product.salePrice)}
                          </span>
                        </div>
                      </div>

                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            changeQuantity(product.id, -1)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            changeQuantity(product.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="item-subtotal">
                        {money(subtotal)}
                      </div>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              <aside className="summary-card">
                <h2>Inquiry Summary</h2>

                <div className="summary-row">
                  <span>Market Price Total</span>
                  <span>{money(totals.market)}</span>
                </div>

                <div className="summary-row">
                  <span>Sale Price Total</span>
                  <span>{money(totals.sale)}</span>
                </div>

                <div className="summary-row savings">
                  <span>You Save</span>
                  <span>{money(totals.savings)}</span>
                </div>

                <div className="summary-total">
                  <span>TOTAL</span>
                  <strong>{money(totals.sale)}</strong>
                </div>

                <button
                  className="button primary full"
                  onClick={() => setShowForm(true)}
                >
                  Proceed to Inquiry
                </button>

                <button
                  className="button secondary full"
                  onClick={() => navigate('products')}
                >
                  Continue Shopping
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================
   CUSTOMER FORM
========================= */

function CustomerForm({
  cart,
  products,
  totals,
  navigate,
}: {
  cart: CartItem[];
  products: typeof import('./products').products;
  totals: {
    market: number;
    sale: number;
    savings: number;
  };
  navigate: (page: Page) => void;
}) {
  const [form, setForm] = useState<CustomerForm>({
    name: '',
    mobile: '',
    area: '',
    message: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!form.mobile.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    if (!form.area.trim()) {
      setError('Please enter your area/location.');
      return;
    }

    setError('');

    /*
      WhatsApp product table.

      Example:

      Name | Qty | Price
      2 ¾ Bird | 3 | ₹24
      3 ½ Lakshmi | 2 | ₹26
    */

    const lines = cart
      .map((item) => {
        const product = products.find(
          (entry) => entry.id === item.productId
        );

        if (!product) return '';

        const price = product.salePrice * item.quantity;

        return `${product.name} | ${item.quantity} | ${money(price)}`;
      })
      .filter(Boolean)
      .join('\n');

    const mobile = form.mobile.trim();

    const text = `NEW CRACKERS INQUIRY

Customer Details
----------------
Name: ${form.name.trim()}
Mobile: ${mobile}
Area: ${form.area.trim()}

Selected Products
----------------
Name | Qty | Price
${lines}

----------------
TOTAL: ${money(totals.sale)}

Additional Message:
${form.message.trim() || 'None'}

Thank you.`;

    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <main>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Almost Done</p>
          <h1>Customer Details</h1>
          <p>
            Enter your details before sending your inquiry.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container form-container">
          <form
            className="customer-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">
                Name <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">
                Mobile Number <span>*</span>
              </label>

              <input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={(event) =>
                  setForm({
                    ...form,
                    mobile: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">
                Area / Location <span>*</span>
              </label>

              <input
                id="area"
                type="text"
                placeholder="Enter your area or location"
                value={form.area}
                onChange={(event) =>
                  setForm({
                    ...form,
                    area: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Additional Message
              </label>

              <textarea
                id="message"
                rows={4}
                placeholder="Any additional requirements..."
                value={form.message}
                onChange={(event) =>
                  setForm({
                    ...form,
                    message: event.target.value,
                  })
                }
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-total">
              <span>Total</span>
              <strong>{money(totals.sale)}</strong>
            </div>

            <button
              type="submit"
              className="button whatsapp-button full"
            >
              💬 Submit Inquiry on WhatsApp
            </button>

            <button
              type="button"
              className="button secondary full"
              onClick={() => navigate('inquiry')}
            >
              Back to Inquiry List
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

/* =========================
   ABOUT
========================= */

function AboutPage() {
  return (
    <main>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Know More</p>
          <h1>About Us</h1>
          <p>
            Making your celebrations brighter and more memorable.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-content">
          <div>
            <p className="eyebrow">About Sparkle Crackers</p>

            <h2>
              Quality crackers for every celebration
            </h2>

            <p>
              We provide a wide range of crackers for festivals,
              celebrations and special occasions.
            </p>

            <p>
              Our goal is to make your shopping experience simple,
              convenient and transparent by displaying both market
              prices and special sale prices.
            </p>

            <p>
              Select your products, choose quantities and send your
              inquiry directly through WhatsApp.
            </p>
          </div>

          <div className="about-highlight">
            <div>
              <strong>Quality</strong>
              <span>Carefully selected products</span>
            </div>

            <div>
              <strong>Value</strong>
              <span>Special sale prices</span>
            </div>

            <div>
              <strong>Easy</strong>
              <span>Simple WhatsApp inquiry</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================
   CONTACT
========================= */

function ContactPage() {
  return (
    <main>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Get In Touch</p>
          <h1>Contact Us</h1>
          <p>
            Have a question? We are happy to help.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📱</div>
            <h3>WhatsApp</h3>
            <p>
              Send your product inquiry directly through WhatsApp.
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h3>Location</h3>
            <p>
              Contact us for our current location and delivery
              details.
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">⏰</div>
            <h3>Support</h3>
            <p>
              We are available to help with your product inquiries.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================
   FOOTER
========================= */

function Footer({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h3>✨ Sparkle Crackers</h3>
          <p>
            Light up your celebrations with quality crackers.
          </p>
        </div>

        <div className="footer-links">
          <button onClick={() => navigate('home')}>
            Home
          </button>

          <button onClick={() => navigate('products')}>
            Products
          </button>

          <button onClick={() => navigate('about')}>
            About
          </button>

          <button onClick={() => navigate('contact')}>
            Contact
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Sparkle Crackers. All rights
        reserved.
      </div>
    </footer>
  );
}

export default App;
