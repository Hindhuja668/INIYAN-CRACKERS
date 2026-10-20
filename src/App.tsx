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
