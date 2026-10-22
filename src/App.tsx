import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Clock3,
  Flame,
  HeartHandshake,
  List,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Tag,
  X,
  Zap,
} from 'lucide-react';

import {
  BUSINESS_AREA,
  BUSINESS_HOURS,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  OWNER_WHATSAPP,
  STORAGE_KEY,
} from '@/config';

import { products, type Product } from '@/products';

type CartItem = {
  productId: number;
  quantity: number;
};

type CartProduct = {
  product: Product;
  quantity: number;
};

type Totals = {
  market: number;
  sale: number;
  savings: number;
};

type Page =
  | 'home'
  | 'products'
  | 'inquiry'
  | 'about'
  | 'contact';

const money = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`;

const getPage = (): Page => {
  const page = window.location.hash.replace('#/', '') as Page;

  return [
    'home',
    'products',
    'inquiry',
    'about',
    'contact',
  ].includes(page)
    ? page
    : 'home';
};

const readCart = (): CartItem[] => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]',
    ) as CartItem[];
  } catch {
    return [];
  }
};

const getTotals = (cart: CartItem[]): Totals =>
  cart.reduce(
    (total, item) => {
      const product = products.find(
        (entry) => entry.id === item.productId,
      );

      if (!product) return total;

      return {
        market:
          total.market +
          product.marketPrice * item.quantity,
        sale:
          total.sale +
          product.salePrice * item.quantity,
        savings:
          total.savings +
          (product.marketPrice - product.salePrice) *
            item.quantity,
      };
    },
    {
      market: 0,
      sale: 0,
      savings: 0,
    },
  );

function App() {
  const [page, setPage] = useState<Page>(getPage);
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setPage(getPage());

    window.addEventListener('hashchange', onHash);

    return () => {
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const navigate = (next: Page) => {
    window.location.hash = `/${next}`;
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (productId: number, quantity: number) => {
    setCart((current) =>
      current.some((item) => item.productId === productId)
        ? current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...current, { productId, quantity }],
    );
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((current) =>
      current.flatMap((item) =>
        item.productId === productId &&
        item.quantity + change <= 0
          ? []
          : item.productId === productId
            ? [{ ...item, quantity: item.quantity + change }]
            : [item],
      ),
    );
  };

  const removeItem = (productId: number) => {
    setCart((current) =>
      current.filter((item) => item.productId !== productId),
    );
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate('home')}
          >
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>

            <span>
              {BUSINESS_NAME}
              <small>Quality fireworks & crackers</small>
            </span>
          </button>

          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            {(['home', 'products', 'about', 'contact'] as Page[]).map(
              (item) => (
                <button
                  key={item}
                  className={page === item ? 'active' : ''}
                  onClick={() => navigate(item)}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ),
            )}
          </nav>

          <button
            className="nav-inquiry"
            onClick={() => navigate('inquiry')}
          >
            <List size={16} />
            Inquiry
            <b>{itemCount}</b>
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {page === 'home' && (
          <Home navigate={navigate} addToCart={addToCart} />
        )}

        {page === 'products' && (
          <ProductsPage addToCart={addToCart} />
        )}

        {page === 'inquiry' && (
          <InquiryPage
            cart={cart}
            totals={getTotals(cart)}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            navigate={navigate}
          />
        )}

        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage />}
      </main>

      <footer className="footer">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>

            <span>
              {BUSINESS_NAME}
              <small>Made for brighter celebrations</small>
            </span>
          </div>

          <p>
            Trusted crackers and fireworks for every celebration.
          </p>
        </div>

        <div className="footer-links">
          <button onClick={() => navigate('products')}>
            Browse products
          </button>

          <button onClick={() => navigate('about')}>
            About us
          </button>

          <a
            href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        </div>

        <p className="copyright">
          © 2026 {BUSINESS_NAME}. Prices shown are from our current list.
        </p>
      </footer>

      <a
        className="floating-whatsapp"
        href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={21} />
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
}
function Home({
  navigate,
  addToCart,
}: {
  navigate: (page: Page) => void;
  addToCart: (id: number, quantity: number) => void;
}) {
  const featured = products.slice(27, 33);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} />
            Factory price list · 2026
          </div>

          <h1>
            Light up your
            <br />
            <em>celebrations.</em>
          </h1>

          <p>
            Bring home the magic of the festival with quality crackers
            at honest, factory-direct prices.
          </p>

          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => navigate('products')}
            >
              View products
              <ArrowRight size={17} />
            </button>

            <button
              className="button ghost-light"
              onClick={() => navigate('inquiry')}
            >
              Make an inquiry
            </button>
          </div>

          <div className="hero-note">
            <ShieldCheck size={17} />
            Quality checked · Packed with care · Easy WhatsApp ordering
          </div>
        </div>

        <div className="hero-art">
          <div className="burst burst-one">✦</div>
          <div className="burst burst-two">✦</div>
          <div className="burst burst-three">✦</div>

          <div className="rocket rocket-one">
            <Zap size={38} />
          </div>

          <div className="rocket rocket-two">
            <Flame size={30} />
          </div>

          <div className="hero-card">
            <span>UP TO</span>
            <strong>80%</strong>
            <small>OFF</small>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <ShieldCheck />
          <span>
            <b>Genuine quality</b>
            <small>Carefully selected products</small>
          </span>
        </div>

        <div>
          <Package />
          <span>
            <b>Factory pricing</b>
            <small>More value in every box</small>
          </span>
        </div>

        <div>
          <HeartHandshake />
          <span>
            <b>Personal service</b>
            <small>We help you choose</small>
          </span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="kicker">Popular picks</span>
            <h2>Made for memorable nights.</h2>
          </div>

          <button
            className="text-button"
            onClick={() => navigate('products')}
          >
            See all products
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="product-grid featured-grid">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="category-banner">
        <div>
          <span className="kicker">One list. Every celebration.</span>
          <h2>
            From a little sparkle
            <br />
            to a sky full of colour.
          </h2>

          <button
            className="button primary"
            onClick={() => navigate('products')}
          >
            Explore the collection
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="category-pills">
          <span>Ground chakkar</span>
          <span>Rockets</span>
          <span>Flower pots</span>
          <span>Electric sparklers</span>
        </div>
      </section>
    </>
  );
} 
function ProductsPage({
  cart,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: {
  cart: CartItem[];
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const getCartQuantity = (productId: number) => {
    return cart.find((item) => item.product.id === productId)?.quantity ?? 0;
  };

  return (
    <main className="page-container products-page">
      <div className="page-heading">
        <span className="eyebrow">OUR COLLECTION</span>
        <h1>Our Products</h1>
        <p>Explore our crackers collection and choose your favourites.</p>
      </div>

      <div className="products-toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search products"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={getCartQuantity(product.id)}
            onAdd={() => onAdd(product)}
            onRemove={() => onRemove(product.id)}
            onUpdateQuantity={(quantity) =>
              onUpdateQuantity(product.id, quantity)
            }
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try another product name or category.</p>
        </div>
      )}
    </main>
  );
}

function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <article className="product-card">
      <div className={`product-art art-${product.id % 6}`}>
        <Sparkles size={32} />
      </div>

      <div className="product-card-content">
        <span className="product-category">{product.category}</span>

        <h3>{product.name}</h3>

        <div className="product-prices">
          <span className="market-price">
            Market Price: {money(product.marketPrice)}
          </span>

          <span className="sale-price">
            Sale Price: {money(product.salePrice)}
          </span>
        </div>

        <div className="product-card-actions">
          {quantity === 0 ? (
            <button className="btn btn-primary" onClick={onAdd}>
              <Plus size={16} />
              Add to List
            </button>
          ) : (
            <div className="quantity-control">
              <button
                type="button"
                onClick={() =>
                  quantity === 1 ? onRemove() : onUpdateQuantity(quantity - 1)
                }
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
function InquiryPage({
  cart,
  onAdd,
  onRemove,
  onUpdateQuantity,
  onClear,
}: {
  cart: CartItem[];
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onClear: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const totals = getTotals(cart);

  return (
    <main className="page-container inquiry-page">
      <div className="page-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Your Inquiry</h1>
        <p>Review your selected crackers before sending your inquiry.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={40} />
          <h2>Your list is empty</h2>
          <p>Add products to your list to start an inquiry.</p>

          <a href="#products" className="btn btn-primary">
            Browse Products
          </a>
        </div>
      ) : (
        <div className="inquiry-layout">
          <section className="inquiry-items">
            <div className="section-heading">
              <h2>Selected Products</h2>

              <button
                type="button"
                className="text-button"
                onClick={onClear}
              >
                Clear List
              </button>
            </div>

            {cart.map(({ product, quantity }) => (
              <div className="inquiry-item" key={product.id}>
                <div className="inquiry-item-info">
                  <h3>{product.name}</h3>

                  <p>
                    Market Price: {money(product.marketPrice)}
                  </p>

                  <p className="sale-price">
                    Sale Price: {money(product.salePrice)}
                  </p>
                </div>

                <div className="inquiry-item-actions">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        quantity === 1
                          ? onRemove(product.id)
                          : onUpdateQuantity(product.id, quantity - 1)
                      }
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      <Minus size={16} />
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(product.id, quantity + 1)
                      }
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <strong>{money(product.salePrice * quantity)}</strong>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onRemove(product.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          <aside className="inquiry-summary">
            <Summary totals={totals} />

            {!showForm ? (
              <button
                type="button"
                className="btn btn-primary full-width"
                onClick={() => setShowForm(true)}
              >
                Continue to Details
                <ArrowRight size={18} />
              </button>
            ) : (
              <CustomerForm cart={cart} totals={totals} />
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
function Summary({ totals }: { totals: Totals }) {
  return (
    <div className="summary-card">
      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Market Price Total</span>
        <span>{money(totals.market)}</span>
      </div>

      <div className="summary-row">
        <span>Sale Price Total</span>
        <span>{money(totals.sale)}</span>
      </div>

      <div className="summary-row savings-row">
        <span>You Save</span>
        <span>{money(totals.savings)}</span>
      </div>

      <div className="summary-total">
        <span>TOTAL</span>
        <strong>{money(totals.sale)}</strong>
      </div>

      <p className="summary-note">
        Your inquiry will be sent through WhatsApp.
      </p>
    </div>
  );
}
function CustomerForm({
  cart,
  totals,
}: {
  cart: CartItem[];
  totals: Totals;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, "");

    if (cleanMobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    const orderLines = cart.map(({ product, quantity }) => {
      const productName = product.name.padEnd(18, " ");
      const qty = String(quantity).padStart(3, " ");
      const price = money(product.salePrice);

      return `${productName} ${qty}  ${price}`;
    });

    const message = [
      "🎆 INIYAN CRACKERS",
      "     ORDER INQUIRY",
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      `Name: ${name.trim()}`,
      `Mobile: ${cleanMobile}`,
      `Area: ${area.trim()}`,
      "",
      "🛒 ORDER DETAILS",
      "",
      "Product             Qty    Price",
      "────────────────────",
      ...orderLines,
      "",
      "────────────────────",
      `💰 TOTAL: ${money(totals.sale)}`,
      "",
      "Thank you!",
    ].join("\n");

    const whatsappNumber = OWNER_WHATSAPP.replace(/\D/g, "");

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>Your Details</h2>

      <p>
        Enter your details to send your product inquiry through WhatsApp.
      </p>

      <label htmlFor="customer-name">Full Name</label>
      <input
        id="customer-name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="customer-mobile">Mobile Number</label>
      <input
        id="customer-mobile"
        type="tel"
        inputMode="numeric"
        placeholder="10-digit mobile number"
        value={mobile}
        onChange={(event) =>
          setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
        }
        required
      />

      <label htmlFor="customer-area">Area / Location</label>
      <input
        id="customer-area"
        type="text"
        placeholder="Enter your area"
        value={area}
        onChange={(event) => setArea(event.target.value)}
        required
      />

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn-whatsapp full-width">
        <MessageCircle size={18} />
        Send Inquiry on WhatsApp
      </button>

      <p className="form-note">
        WhatsApp will open with your inquiry message. Review it and tap Send.
      </p>
    </form>
  );
}
function AboutPage() {
  return (
    <main className="page-container about-page">
      <div className="page-heading">
        <span className="eyebrow">ABOUT US</span>
        <h1>About Iniyan Crackers</h1>
        <p>
          Bringing brightness, happiness, and celebration to every occasion.
        </p>
      </div>

      <section className="about-content">
        <div className="about-card">
          <Sparkles size={32} />
          <h2>Our Story</h2>
          <p>
            Iniyan Crackers aims to make your celebrations special with a
            selection of crackers for families and festive occasions.
          </p>
        </div>

        <div className="about-card">
          <Heart size={32} />
          <h2>Our Promise</h2>
          <p>
            We focus on helping customers explore products, compare prices,
            and send their inquiries conveniently through WhatsApp.
          </p>
        </div>

        <div className="about-card">
          <Gift size={32} />
          <h2>Our Collection</h2>
          <p>
            Explore our product range, including individual products,
            gift boxes, and family packs.
          </p>
        </div>
      </section>
    </main>
  );
}
function ContactRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="contact-row">
      <div className="contact-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}

function ContactPage() {
  const whatsappNumber = OWNER_WHATSAPP.replace(/\D/g, "");

  return (
    <main className="page-container contact-page">
      <div className="page-heading">
        <span className="eyebrow">GET IN TOUCH</span>
        <h1>Contact Us</h1>
        <p>Have questions about our products? Get in touch with us.</p>
      </div>

      <section className="contact-card">
        <ContactRow
          icon={<MapPin size={22} />}
          title="Our Location"
        >
          <p>{BUSINESS_AREA}</p>
        </ContactRow>

        <ContactRow
          icon={<Phone size={22} />}
          title="Phone Number"
        >
          <p>{BUSINESS_PHONE}</p>
        </ContactRow>

        <ContactRow
          icon={<Clock size={22} />}
          title="Business Hours"
        >
          <p>{BUSINESS_HOURS}</p>
        </ContactRow>

        <a
          className="btn btn-whatsapp full-width"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} />
          Contact on WhatsApp
        </a>
      </section>
    </main>
  );
}

export default App;
