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

        <div
