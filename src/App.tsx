import { useEffect, useMemo, useState } from 'react';
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

type Totals = {
  market: number;
  sale: number;
  savings: number;
};

type Page = 'home' | 'products' | 'inquiry' | 'about' | 'contact';

const money = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`;

const getPage = (): Page => {
  const page = window.location.hash.replace('#/', '') as Page;

  return ['home', 'products', 'inquiry', 'about', 'contact'].includes(page)
    ? page
    : 'home';
};

const readCart = (): CartItem[] => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    ) as CartItem[];
  } catch {
    return [];
  }
};

const getTotals = (cart: CartItem[]): Totals =>
  cart.reduce(
    (total, item) => {
      const product = products.find(
        (entry) => entry.id === item.productId
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
    }
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
    0
  );

  const navigate = (next: Page) => {
    window.location.hash = `/${next}`;
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const addToCart = (
    productId: number,
    quantity: number
  ) => {
    setCart((current) =>
      current.some(
        (item) => item.productId === productId
      )
        ? current.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          )
        : [
            ...current,
            {
              productId,
              quantity,
            },
          ]
    );
  };

  const updateQuantity = (
    productId: number,
    change: number
  ) => {
    setCart((current) =>
      current.flatMap((item) =>
        item.productId === productId &&
        item.quantity + change <= 0
          ? []
          : item.productId === productId
          ? [
              {
                ...item,
                quantity:
                  item.quantity + change,
              },
            ]
          : [item]
      )
    );
  };

  const removeItem = (productId: number) => {
    setCart((current) =>
      current.filter(
        (item) => item.productId !== productId
      )
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
              <small>
                Quality fireworks & crackers
              </small>
            </span>
          </button>

          <button
            className="menu-toggle"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav
            className={
              menuOpen
                ? 'main-nav open'
                : 'main-nav'
            }
          >
            {(
              [
                'home',
                'products',
                'about',
                'contact',
              ] as Page[]
            ).map((item) => (
              <button
                key={item}
                className={
                  page === item ? 'active' : ''
                }
                onClick={() =>
                  navigate(item)
                }
              >
                {item[0].toUpperCase() +
                  item.slice(1)}
              </button>
            ))}

            <button
              className="nav-inquiry"
              onClick={() =>
                navigate('inquiry')
              }
            >
              <List size={16} />
              Inquiry
              <b>{itemCount}</b>
            </button>
          </nav>
        </div>
      </header>

      <main>
        {page === 'home' && (
          <Home
            navigate={navigate}
            addToCart={addToCart}
          />
        )}

        {page === 'products' && (
          <ProductsPage
            addToCart={addToCart}
          />
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

        {page === 'about' && (
          <About navigate={navigate} />
        )}

        {page === 'contact' && <Contact />}
      </main>

      <footer className="footer">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>

            <span>
              {BUSINESS_NAME}
              <small>
                Made for brighter celebrations
              </small>
            </span>
          </div>

          <p>
            Trusted crackers and fireworks for
            every celebration.
          </p>
        </div>

        <div className="footer-links">
          <button
            onClick={() =>
              navigate('products')
            }
          >
            Browse products
          </button>

          <button
            onClick={() =>
              navigate('about')
            }
          >
            About us
          </button>

          <a
            href={`https://wa.me/${OWNER_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        </div>

        <p className="copyright">
          © 2026 {BUSINESS_NAME}. Prices shown
          are from our current list.
        </p>
      </footer>

      <a
        className="floating-whatsapp"
        href={`https://wa.me/${OWNER_WHATSAPP}`}
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
  addToCart: (
    id: number,
    quantity: number
  ) => void;
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
            Bring home the magic of the festival
            with quality crackers at honest,
            factory-direct prices.
          </p>

          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() =>
                navigate('products')
              }
            >
              View products
              <ArrowRight size={17} />
            </button>

            <button
              className="button ghost-light"
              onClick={() =>
                navigate('inquiry')
              }
            >
              Make an inquiry
            </button>
          </div>

          <div className="hero-note">
            <ShieldCheck size={17} />
            Quality checked · Packed with care ·
            Easy WhatsApp ordering
          </div>
        </div>

        <div className="hero-art">
          <div className="burst burst-one">
            ✦
          </div>

          <div className="burst burst-two">
            ✦
          </div>

          <div className="burst burst-three">
            ✦
          </div>

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
            <small>
              Carefully selected products
            </small>
          </span>
        </div>

        <div>
          <Package />

          <span>
            <b>Factory pricing</b>
            <small>
              More value in every box
            </small>
          </span>
        </div>

        <div>
          <HeartHandshake />

          <span>
            <b>Personal service</b>
            <small>
              We help you choose
            </small>
          </span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="kicker">
              Popular picks
            </span>

            <h2>
              Made for memorable nights.
            </h2>
          </div>

          <button
            className="text-button"
            onClick={() =>
              navigate('products')
            }
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
          <span className="kicker">
            One list. Every celebration.
          </span>

          <h2>
            From a little sparkle
            <br />
            to a sky full of colour.
          </h2>

          <button
            className="button primary"
            onClick={() =>
              navigate('products')
            }
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
  addToCart,
}: {
  addToCart: (
    id: number,
    quantity: number
  ) => void;
}) {
  const [search, setSearch] =
    useState('');
  const [category, setCategory] =
    useState('All');

  const categories = [
    'All',
    ...Array.from(
      new Set(
        products.map(
          (product) => product.category
        )
      )
    ),
  ];

  const shown = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'All' ||
            product.category ===
              category) &&
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      ),
    [category, search]
  );

  return (
    <section className="section page-section">
      <div className="page-title">
        <div>
          <span className="kicker">
            The collection
          </span>

          <h1>
            Choose your celebration.
          </h1>

          <p>
            {products.length} products · Market
            and sale prices shown clearly.
          </p>
        </div>

        <div className="search-box">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products"
          />
        </div>
      </div>

      <div className="filter-row">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? 'filter active'
                : 'filter'
            }
            onClick={() =>
              setCategory(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {shown.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="empty-state">
          <Search size={32} />

          <h3>No products found</h3>

          <p>
            Try a different search or category.
          </p>
        </div>
      )}
    </section>
  );
}

function ProductCard({
  product,
  addToCart,
}: {
  product: Product;
  addToCart: (
    id: number,
    quantity: number
  ) => void;
}) {
  const [quantity, setQuantity] =
    useState(1);

  const savings =
    product.marketPrice -
    product.salePrice;

  return (
    <article className="product-card">
      <div
        className={`product-art art-${
          product.id % 6
        }`}
      >
        <Sparkles size={38} />
        <span>{product.category}</span>
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <div className="prices">
          <span className="market">
            Market {money(product.marketPrice)}
          </span>

          <strong>
            Sale {money(product.salePrice)}
          </strong>

          <small>
            Save {money(savings)}
          </small>
        </div>

        <div className="card-actions">
          <div className="quantity">
            <button
              aria-label="Decrease quantity"
              onClick={() =>
                setQuantity(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
              }
            >
              <Minus size={14} />
            </button>

            <span>{quantity}</span>

            <button
              aria-label="Increase quantity"
              onClick={() =>
                setQuantity(quantity + 1)
              }
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            className="add-button"
            disabled={!product.available}
            onClick={() =>
              addToCart(
                product.id,
                quantity
              )
            }
          >
            {product.available
              ? 'Add to inquiry'
              : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}

function InquiryPage({
  cart,
  totals,
  updateQuantity,
  removeItem,
  navigate,
}: {
  cart: CartItem[];
  totals: Totals;
  updateQuantity: (
    id: number,
    change: number
  ) => void;
  removeItem: (id: number) => void;
  navigate: (page: Page) => void;
}) {
  const [showForm, setShowForm] =
    useState(false);

  return (
    <section className="section page-section">
      <div className="page-title compact">
        <div>
          <span className="kicker">
            Your selection
          </span>

          <h1>Inquiry list.</h1>

          <p>
            Review your products before sending
            your request.
          </p>
        </div>

        <div className="inquiry-count">
          <List size={17} />

          {cart.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          )}{' '}
          items
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state cart-empty">
          <Package size={40} />

          <h3>
            Your inquiry is empty
          </h3>

          <p>
            Add products to see them here and
            get your total.
          </p>

          <button
            className="button primary"
            onClick={() =>
              navigate('products')
            }
          >
            Browse products
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="inquiry-layout">
          <div className="inquiry-list">
            {cart.map((item) => {
              const product =
                products.find(
                  (entry) =>
                    entry.id ===
                    item.productId
                );

              if (!product) return null;

              return (
                <div
                  className="inquiry-item"
                  key={product.id}
                >
                  <div
                    className={`mini-art art-${
                      product.id % 6
                    }`}
                  >
                    <Sparkles size={22} />
                  </div>

                  <div className="item-main">
                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      Market{' '}
                      {money(
                        product.marketPrice
                      )}{' '}
                      <span>·</span> Sale{' '}
                      {money(
                        product.salePrice
                      )}
                    </p>
                  </div>

                  <div className="quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          product.id,
                          -1
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          product.id,
                          1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong className="item-subtotal">
                    {money(
                      product.salePrice *
                        item.quantity
                    )}
                  </strong>

                  <button
                    className="remove-button"
                    aria-label={`Remove ${product.name}`}
                    onClick={() =>
                      removeItem(
                        product.id
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              );
            })}

            <button
              className="continue-button"
              onClick={() =>
                navigate('products')
              }
            >
              <ChevronLeft size={16} />
              Continue shopping
            </button>
          </div>

          <Summary
            totals={totals}
            onProceed={() =>
              setShowForm(true)
            }
          />
        </div>
      )}

      {showForm && (
        <CustomerForm
          cart={cart}
          totals={totals}
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </section>
  );
}

function Summary({
  totals,
  onProceed,
}: {
  totals: Totals;
  onProceed: () => void;
}) {
  return (
    <aside className="summary">
      <h2>Inquiry summary</h2>

      <div className="summary-line">
        <span>Market price total</span>

        <strong>
          {money(totals.market)}
        </strong>
      </div>

      <div className="summary-line sale-line">
        <span>Sale price total</span>

        <strong>
          {money(totals.sale)}
        </strong>
      </div>

      <div className="saving-line">
        <Check size={15} />

        You save {money(totals.savings)}
      </div>

      <div className="total-line">
        <span>Total</span>

        <strong>
          {money(totals.sale)}
        </strong>
      </div>

      <button
        className="button primary full"
        onClick={onProceed}
      >
        Proceed to inquiry
        <ArrowRight size={17} />
      </button>

      <p className="summary-note">
        No payment required. We’ll prepare
        your inquiry in WhatsApp.
      </p>
    </aside>
  );
}

function CustomerForm({
  cart,
  totals,
  onClose,
}: {
  cart: CartItem[];
  totals: Totals;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    area: '',
    message: '',
  });

  const [error, setError] =
    useState('');

  const submit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const mobile =
      form.mobile.replace(/\D/g, '');

    if (
      !form.name.trim() ||
      !mobile ||
      !form.area.trim()
    ) {
      return setError(
        'Please complete all required fields.'
      );
    }

    if (
      !/^[6-9]\d{9}$/.test(mobile)
    ) {
      return setError(
        'Enter a valid 10-digit Indian mobile number.'
      );
    }

    /*
     * WhatsApp product message
     */

    const lines = cart
      .map((item, index) => {
        const product =
          products.find(
            (entry) =>
              entry.id === item.productId
          );

        if (!product) return '';

        const price =
          product.salePrice * item.quantity;

        return `${index + 1}. ${product.name}
   Qty: ${item.quantity}
   Amount: ${money(price)}`;
      })
      .filter(Boolean)
      .join('\n\n');

    const text = `🎆 NEW CRACKERS INQUIRY

👤 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━
Name: ${form.name.trim()}
Mobile: ${mobile}
Area: ${form.area.trim()}

🛍️ SELECTED PRODUCTS
━━━━━━━━━━━━━━━━━━
${lines}

━━━━━━━━━━━━━━━━━━
💰 TOTAL: ${money(totals.sale)}

📝 ADDITIONAL MESSAGE
${form.message.trim() || 'None'}

Thank you for your inquiry! 🙏`;

    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
        text
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <form
        className="details-form"
        onSubmit={submit}
      >
        <button
          type="button"
          className="close-button"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <span className="kicker">
          Almost there
        </span>

        <h2>Customer details.</h2>

        <p>
          We’ll open WhatsApp only after you
          submit these details.
        </p>

        <label>
          Name *
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
            placeholder="Your full name"
          />
        </label>

        <label>
          Mobile number *
          <input
            required
            inputMode="numeric"
            value={form.mobile}
            onChange={(event) =>
              setForm({
                ...form,
                mobile:
                  event.target.value,
              })
            }
            placeholder="10-digit mobile number"
          />
        </label>

        <label>
          Area / location *
          <input
            required
            value={form.area}
            onChange={(event) =>
              setForm({
                ...form,
                area: event.target.value,
              })
            }
            placeholder="Where should we reach you?"
          />
        </label>

        <label>
          Additional message
          <textarea
            value={form.message}
            onChange={(event) =>
              setForm({
                ...form,
                message:
                  event.target.value,
              })
            }
            placeholder="Any preferences or questions?"
            rows={3}
          />
        </label>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <button
          className="button primary full"
          type="submit"
        >
          <MessageCircle size={18} />
          Submit inquiry on WhatsApp
        </button>
      </form>
    </div>
  );
}

function About({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  return (
    <section className="section page-section about-page">
      <div className="about-hero">
        <div>
          <span className="kicker">
            Our story
          </span>

          <h1>
            Bringing joy to your
            celebrations.
          </h1>

          <p>
            Iniyan Crackers brings you a wide
            range of quality fireworks at factory
            prices, so every family can celebrate
            with confidence.
          </p>
        </div>

        <div className="about-seal">
          <Sparkles size={30} />

          <span>
            Since
            <br />
            <b>2026</b>
          </span>
        </div>
      </div>

      <div className="values-grid">
        <Value
          icon={<ShieldCheck />}
          title="Quality first"
          text="Every product is selected with care for a bright, dependable celebration."
        />

        <Value
          icon={<HeartHandshake />}
          title="Helpful service"
          text="Tell us what you need and we’ll help you build the right inquiry."
        />

        <Value
          icon={<Package />}
          title="More variety"
          text="From sparklers and flower pots to rockets and repeating cakes."
        />
      </div>

      <div className="about-callout">
        <div>
          <span className="kicker">
            Ready to celebrate?
          </span>

          <h2>
            Make your list.
            <br />
            We’ll take it from there.
          </h2>
        </div>

        <button
          className="button primary"
          onClick={() =>
            navigate('products')
          }
        >
          Browse products
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="value-card">
      <div className="value-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function Contact() {
  return (
    <section className="section page-section contact-page">
      <div className="page-title">
        <div>
          <span className="kicker">
            We’re here to help
          </span>

          <h1>Contact us.</h1>

          <p>
            Have a question about a product or
            your inquiry? Reach out.
          </p>
        </div>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <ContactRow
            icon={<Phone />}
            title="Call us"
            value={BUSINESS_PHONE}
            href={`tel:${BUSINESS_PHONE.replace(
              /\s/g,
              ''
            )}`}
          />

          <ContactRow
            icon={<MessageCircle />}
            title="WhatsApp"
            value="Chat with our team"
            href={`https://wa.me/${OWNER_WHATSAPP}`}
          />

          <ContactRow
            icon={<MapPin />}
            title="Our area"
            value={BUSINESS_AREA}
          />

          <ContactRow
            icon={<Clock3 />}
            title="Business hours"
            value={BUSINESS_HOURS}
          />
        </div>

        <div className="contact-panel">
          <Sparkles size={32} />

          <h2>
            Let’s make your celebration
            brighter.
          </h2>

          <p>
            Send us your product list through
            WhatsApp and we’ll get back to you
            with the details.
          </p>

          <a
            className="button primary"
            href={`https://wa.me/${OWNER_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="contact-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </>
  );

  return href ? (
    <a
      className="contact-row"
      href={href}
      target={
        href.startsWith('https')
          ? '_blank'
          : undefined
      }
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div className="contact-row">
      {content}
    </div>
  );
}

export default App;
