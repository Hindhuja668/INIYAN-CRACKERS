import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { jsPDF } from 'jspdf';
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
  addToCart,
}: {
  addToCart: (id: number, quantity: number) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const shown = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'All' || product.category === category) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search],
  );

  return (
    <section className="section page-section">
      <div className="page-title">
        <div>
          <span className="kicker">The collection</span>
          <h1>Choose your celebration.</h1>
          <p>
            {products.length} products · Market and sale prices shown clearly.
          </p>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
          />
        </div>
      </div>

      <div className="filter-row">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? 'filter active' : 'filter'}
            onClick={() => setCategory(item)}
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
          <p>Try a different search or category.</p>
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
  addToCart: (id: number, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const savings = product.marketPrice - product.salePrice;

  return (
    <article className="product-card">
      <div
        className={`product-art art-${product.id % 6} category-${product.category
          .toLowerCase()
          .replace(/\s+/g, '-')}`}
      >
        <Sparkles size={38} />
        <span>{product.category}</span>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>

        <div className="prices">
          <span className="market">
            Market {money(product.marketPrice)}
          </span>

          <strong>Sale {money(product.salePrice)}</strong>
          <small>Save {money(savings)}</small>
        </div>

        <div className="card-actions">
          <div className="quantity">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={14} />
            </button>

            <span>{quantity}</span>

            <button
              aria-label="Increase quantity"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            className="add-button"
            disabled={!product.available}
            onClick={() => addToCart(product.id, quantity)}
          >
            {product.available ? 'Add to inquiry' : 'Unavailable'}
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
  updateQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
  navigate: (page: Page) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const cartProducts: CartProduct[] = cart.flatMap((item) => {
    const product = products.find(
      (entry) => entry.id === item.productId,
    );

    return product ? [{ product, quantity: item.quantity }] : [];
  });

  return (
    <section className="section page-section">
      <div className="page-title compact">
        <div>
          <span className="kicker">Your selection</span>
          <h1>Inquiry list.</h1>
          <p>Review your products before sending your request.</p>
        </div>

        <div className="inquiry-count">
          <List size={17} />
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
        </div>
      </div>

      {cartProducts.length === 0 ? (
        <div className="empty-state cart-empty">
          <Package size={40} />
          <h3>Your inquiry is empty</h3>
          <p>Add products to see them here and get your total.</p>

          <button
            className="button primary"
            onClick={() => navigate('products')}
          >
            Browse products
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="inquiry-layout">
          <div className="inquiry-list">
            {cartProducts.map(({ product, quantity }) => (
              <div className="inquiry-item" key={product.id}>
                <div className={`mini-art art-${product.id % 6}`}>
                  <Sparkles size={22} />
                </div>

                <div className="item-main">
                  <h3>{product.name}</h3>
                  <p>
                    Market {money(product.marketPrice)}{' '}
                    <span>·</span> Sale {money(product.salePrice)}
                  </p>
                </div>

                <div className="quantity">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus size={14} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <strong className="item-subtotal">
                  {money(product.salePrice * quantity)}
                </strong>

                <button
                  className="remove-button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => removeItem(product.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            <button
              className="continue-button"
              onClick={() => navigate('products')}
            >
              <ChevronLeft size={16} />
              Continue shopping
            </button>
          </div>

          <Summary
            totals={totals}
            onProceed={() => setShowForm(true)}
          />
        </div>
      )}

      {showForm && (
        <CustomerForm
          cart={cartProducts}
          totals={totals}
          onClose={() => setShowForm(false)}
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
        <strong>{money(totals.market)}</strong>
      </div>

      <div className="summary-line sale-line">
        <span>Sale price total</span>
        <strong>{money(totals.sale)}</strong>
      </div>

      <div className="saving-line">
        <Check size={15} />
        You save {money(totals.savings)}
      </div>

      <div className="total-line">
        <span>Total</span>
        <strong>{money(totals.sale)}</strong>
      </div>

      <button
        className="button primary full"
        onClick={onProceed}
      >
        Proceed to inquiry
        <ArrowRight size={17} />
      </button>

      <p className="summary-note">
        No payment required. We’ll prepare your inquiry in WhatsApp.
      </p>
    </aside>
  );
              }
      }

function CustomerForm({
  cart,
  totals,
  onClose,
}: {
  cart: CartProduct[];
  totals: Totals;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    area: '',
    message: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const name = form.name.trim();
    const mobile = form.mobile.replace(/\D/g, '');
    const area = form.area.trim();
    const message = form.message.trim();

    if (!name || !mobile || !area) {
      setError('Please fill in your name, mobile number and area.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const ownerNumber = OWNER_WHATSAPP.replace(/\D/g, '');

    if (!ownerNumber) {
      setError('WhatsApp number is not configured. Please contact the shop.');
      return;
    }

    setSubmitting(true);

    try {
      const invoiceId = `INI-${Date.now().toString().slice(-6)}`;
      const invoiceDate = new Date().toLocaleDateString('en-IN');

      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const right = pageWidth - margin;

      const drawTableHeader = (y: number) => {
        doc.setFillColor(255, 237, 213);
        doc.rect(margin, y, pageWidth - margin * 2, 9, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(80, 50, 30);

        doc.text('Product', margin + 2, y + 6);
        doc.text('Qty', right - 62, y + 6, { align: 'right' });
        doc.text('Market', right - 40, y + 6, { align: 'right' });
        doc.text('Sale', right - 21, y + 6, { align: 'right' });
        doc.text('Total', right - 2, y + 6, { align: 'right' });
      };

      // Invoice header
      doc.setFillColor(255, 247, 237);
      doc.rect(0, 0, pageWidth, 47, 'F');

      doc.setTextColor(124, 45, 18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(21);
      doc.text(BUSINESS_NAME, margin, 17);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(BUSINESS_AREA, margin, 25);
      doc.text(`Phone: ${BUSINESS_PHONE}`, margin, 32);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('INQUIRY INVOICE', right, 17, {
        align: 'right',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Invoice: ${invoiceId}`, right, 25, {
        align: 'right',
      });
      doc.text(`Date: ${invoiceDate}`, right, 32, {
        align: 'right',
      });

      // Customer details
      let y = 58;

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Customer Details', margin, y);

      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Name: ${name}`, margin, y);

      y += 6;
      doc.text(`Mobile: ${mobile}`, margin, y);

      y += 6;
      doc.text(`Area: ${area}`, margin, y);

      y += 12;
      drawTableHeader(y);
      y += 14;

      // Product rows
      cart.forEach(({ product, quantity }) => {
        const nameLines = doc.splitTextToSize(product.name, 68);
        const rowHeight = Math.max(8, nameLines.length * 4.5 + 2);

        if (y + rowHeight > pageHeight - 42) {
          doc.addPage();
          y = 18;
          drawTableHeader(y);
          y += 14;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(45, 45, 45);

        doc.text(nameLines, margin + 2, y);

        doc.text(String(quantity), right - 62, y, {
          align: 'right',
        });

        doc.text(money(product.marketPrice), right - 40, y, {
          align: 'right',
        });

        doc.text(money(product.salePrice), right - 21, y, {
          align: 'right',
        });

        doc.text(
          money(product.salePrice * quantity),
          right - 2,
          y,
          { align: 'right' },
        );

        y += rowHeight;

        doc.setDrawColor(235, 235, 235);
        doc.line(margin, y - 2, right, y - 2);
      });

      // Totals
      if (y + 42 > pageHeight - 12) {
        doc.addPage();
        y = 20;
      }

      y += 5;

      const addTotal = (
        label: string,
        amount: number,
        bold = false,
      ) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(bold ? 11 : 10);
        doc.setTextColor(55, 55, 55);

        doc.text(label, right - 65, y);
        doc.text(money(amount), right, y, {
          align: 'right',
        });

        y += bold ? 8 : 6;
      };

      addTotal('Market Price Total', totals.market);
      addTotal('You Save', totals.savings);
      addTotal('Sale Price Total', totals.sale, true);

      // Optional message
      if (message) {
        y += 5;

        if (y + 20 > pageHeight - 12) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Additional Message', margin, y);

        y += 6;

        doc.setFont('helvetica', 'normal');

        const messageLines = doc.splitTextToSize(
          message,
          pageWidth - margin * 2,
        );

        doc.text(messageLines, margin, y);
      }

      // WhatsApp message
      const productLines = cart
        .map(
          ({ product, quantity }) =>
            `${product.name}    ${quantity}    ${money(
              product.salePrice * quantity,
            )}`,
        )
        .join('\n');

      const whatsappText =
        `Hello ${BUSINESS_NAME}, I would like to submit my crackers inquiry.\n\n` +
        `Invoice: ${invoiceId}\n` +
        `Name: ${name}\n` +
        `Mobile: ${mobile}\n` +
        `Area: ${area}\n\n` +
        `Name        Qty        Price\n` +
        `${productLines}\n\n` +
        `Market Price Total: ${money(totals.market)}\n` +
        `You Save: ${money(totals.savings)}\n` +
        `TOTAL: ${money(totals.sale)}` +
        (message ? `\n\nAdditional Message: ${message}` : '') +
        `\n\nPlease find the invoice PDF attached separately.`;

      const whatsappUrl =
        `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Open WhatsApp directly; download invoice separately.
      doc.save(`${invoiceId}.pdf`);

      window.location.href = whatsappUrl;
    } catch (submitError) {
      console.error('Inquiry submission failed:', submitError);
      setError(
        'Could not prepare your inquiry. Please try again.',
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-form-title"
    >
      <form className="details-form" onSubmit={submit}>
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={20} />
        </button>

        <span className="kicker">Almost there</span>

        <h2 id="customer-form-title">Customer details.</h2>

        <p>
          Enter your details to prepare your invoice and open
          the WhatsApp inquiry.
        </p>

        <label>
          Name
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Mobile number
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={form.mobile}
            onChange={(event) =>
              setForm({ ...form, mobile: event.target.value })
            }
            placeholder="10-digit mobile number"
            required
          />
        </label>

        <label>
          Area / location
          <input
            type="text"
            autoComplete="address-level2"
            value={form.area}
            onChange={(event) =>
              setForm({ ...form, area: event.target.value })
            }
            placeholder="Your area or town"
            required
          />
        </label>

        <label>
          Additional message (optional)
          <textarea
            value={form.message}
            onChange={(event) =>
              setForm({ ...form, message: event.target.value })
            }
            placeholder="Any additional information?"
            rows={3}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="button button-primary submit-button"
          disabled={submitting}
        >
          {submitting ? 'Preparing inquiry...' : 'Submit inquiry on WhatsApp'}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}

function AboutPage() {
  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="kicker">About us</span>
        <h1>Making every celebration brighter.</h1>

        <p>
          At {BUSINESS_NAME}, we help families celebrate their
          special moments with a selection of crackers at clear,
          affordable prices.
        </p>
      </div>

      <div className="about-grid">
        <article className="about-card">
          <Sparkles size={28} />
          <h3>Celebration for everyone</h3>
          <p>
            Explore products for festivals, family gatherings and
            special occasions.
          </p>
        </article>

        <article className="about-card">
          <Tag size={28} />
          <h3>Clear pricing</h3>
          <p>
            Compare market prices and sale prices before adding
            products to your inquiry.
          </p>
        </article>

        <article className="about-card">
          <MessageCircle size={28} />
          <h3>Easy inquiries</h3>
          <p>
            Select your products and send your inquiry through
            WhatsApp.
          </p>
        </article>
      </div>

      <div className="about-note">
        <h2>Celebrate responsibly.</h2>
        <p>
          Follow local rules, read safety instructions and use
          fireworks responsibly. Supervise children and maintain
          a safe distance.
        </p>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="contact-row">
      <div className="contact-icon">{icon}</div>

      <div className="contact-row-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ContactPage() {
  const whatsappNumber = OWNER_WHATSAPP.replace(/\D/g, '');

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="kicker">Contact us</span>
        <h1>We’re happy to help.</h1>

        <p>
          Have a question about products or pricing? Contact us
          using the details below.
        </p>
      </div>

      <div className="contact-card">
        <ContactRow
          icon={<MapPin size={22} />}
          title="Our location"
        >
          <p>{BUSINESS_AREA}</p>
        </ContactRow>

        <ContactRow
          icon={<Phone size={22} />}
          title="Phone"
        >
          <a href={`tel:${BUSINESS_PHONE}`}>
            {BUSINESS_PHONE}
          </a>
        </ContactRow>

        <ContactRow
          icon={<Clock3 size={22} />}
          title="Business hours"
        >
          <p>{BUSINESS_HOURS}</p>
        </ContactRow>

        <ContactRow
          icon={<MessageCircle size={22} />}
          title="WhatsApp"
        >
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat with us on WhatsApp
          </a>
        </ContactRow>
      </div>

      <div className="contact-cta">
        <h2>Ready to make an inquiry?</h2>

        <p>
          Select your products and send us your list through WhatsApp.
        </p>

        <a
          className="button primary"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact us on WhatsApp
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

export default App;
