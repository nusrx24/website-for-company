---
## HERO ########################################################################
# Answers: what does LapCircuit do?
banner:
  # Words between ** ** are lit in the brand's blue; the rest in white.
  title: "Run your **business.**<br>Your **way.**"
  # One short sentence picked out with a blue highlighter under the headline:
  # how the software is paid for. Leave it out and nothing is shown.
  promise: "One-time payment. Yours for life."
  content: "Affordable POS and business management software built around the way your business actually works — from offline desktop systems to dedicated desktop applications and cloud-based desktop + mobile solutions."
  button_primary:
    label: "Request a Demo"
    link: "whatsapp"
  link_secondary:
    label: "See Our Solutions"
    link: "#solutions"

## ABOUT ########################################################################
# Answers: why does custom software matter?
# The image sits under the heading. It is a real screenshot of a delivered
# system, not a mock-up.
about:
  title: "Your business is not a template."
  media:
    image: "/images/projects/uj-stores-2.jpg"
    alt: "The dashboard of the POS system LapCircuit built for UJ Stores, with menus for sales, customers, suppliers, purchase orders, inventory, payments, cheques and bank accounts"
    caption: "The dashboard of the system we built for UJ Stores in Eravur."
  paragraphs:
    - "A grocery shop, a rice distributor and a mobile phone shop do not sell, stock or collect payment in the same way. Most software asks them to change how they work to fit the product."
    - "We do it the other way round. We learn how your business already runs, then build the system around it."
    - "LapCircuit is a registered software company. We work directly with business owners in Tamil, English and Sinhala, and you deal with the people who build your system."

## SOLUTIONS ####################################################################
# Answers: what can LapCircuit build?
# Prices are starting prices: each is printed as "From ... +", and the
# sentence under the heading says so.
solutions:
  title: "What we build."
  content: "Every system is shaped around how the business already works. Starting prices are published, so you know the range before you contact us."
  # Each solution is printed as a till receipt.
  #   lines   - what the price includes. Keep each to about 16 letters so it
  #             fits on one line of the slip.
  #   badge   - optional rubber stamp across the top of the slip.
  #   price   - leave out for work that is quoted; the slip then shows the
  #             quote wording from `receipt` below.
  #   enquiry - the WhatsApp message the slip's button starts.
  receipt:
    included: "Incl"
    # Printed above the total on every slip. This is the only place the
    # warranty is stated, so keep "Bug-fix": it covers bugs and errors, and
    # new features, modules and integrations are quoted separately.
    extras:
      - label: "Hardware"
        value: "Optional"
      - label: "Bug-fix warranty"
        value: "Lifetime"
    quote_label: "Total"
    quote_value: "On quote"
    cta: "Request a quote"
    thanks: "Thank you"
  items:
    - title: "Offline Desktop"
      content: "A complete system that runs on the shop computer, with no internet needed."
      badge: "Works offline"
      lines:
        - "Runs offline"
        - "Single location"
        - "Install + setup"
      price_prefix: "From"
      price: "LKR 30,000+"
      enquiry: "Hello LapCircuit, I would like a quote for the Offline Desktop solution."
    - title: "Desktop Application"
      content: "A dedicated desktop application built around your workflow."
      lines:
        - "Dedicated app"
        - "Custom workflow"
        - "Team training"
      price_prefix: "From"
      price: "LKR 35,000+"
      enquiry: "Hello LapCircuit, I would like a quote for the Desktop Application solution."
    - title: "Cloud + Mobile"
      content: "Desktop and mobile access to the same system, so you can check the business from anywhere."
      lines:
        - "Desktop + mobile"
        - "Multi-branch"
        - "Reports anywhere"
      price_prefix: "From"
      price: "LKR 55,000+"
      enquiry: "Hello LapCircuit, I would like a quote for the Cloud + Mobile solution."
    - title: "Custom Business Software"
      content: "When your workflow does not fit a standard product, we develop around your actual requirements."
      lines:
        - "Workflow study"
        - "Custom build"
        - "Setup + training"
      enquiry: "Hello LapCircuit, I would like a quote for custom business software."

## WORK #########################################################################
# Answers: has it been built for real businesses?
# Rule for this section: only what the system actually does. No revenue figures,
# no "% improvement", no customer counts. See PROJECT-PHOTOS.md before adding a
# photo, and project-photos-source/README.md for what must never be published.
projects:
  title: "Systems running in real businesses."
  label: "Our work in the real world"
  content: "See the businesses we’ve worked with, completed projects, customer success stories, and ongoing solutions on our Facebook page."
  link:
    label: "Visit our Facebook page"
    href: "https://www.facebook.com/lapcircuit"
  # The clients, shown as a carousel of logos: three at a time, changing every
  # two seconds. A client appears once it has a `name` and a `logo` (a tile in
  # public/images/clients, 400 x 424 with the artwork on a plain ground).
  #
  # `sector`, `location`, `summary` and `image` are NOT printed at present.
  # They belong to the earlier design (a card per client with a photograph)
  # and are kept so that design can come back without rewriting them.
  items:
    - name: "UJ Stores"
      sector: "Wholesale and grocery"
      location: "Eravur"
      summary: "A full counter and back-office system: sales and sales history, customers, suppliers, purchase orders, products, inventory, payments, cheques and bank accounts."
      logo: "/images/clients/uj-stores.webp"
      image:
        src: "/images/projects/uj-stores-3.jpg"
        alt: "Handing over the completed UJ Stores system, running on the shop's laptop"
        focus: "50% 30%"

    - name: "MBRK Rice Distribution"
      sector: "Rice distribution"
      summary: "A distribution system where cheque handling matters as much as sales, with a business report view over the whole operation."
      logo: "/images/clients/mbrk-rice.webp"
      image:
        src: "/images/projects/mbrk-2.jpg"
        alt: "The MBRK Rice system on a laptop, showing the dashboard totals and the cheque management screen"
        focus: "42% 45%"

    - name: "Red Zone"
      sector: "Mobile shop"
      location: "Eravur"
      summary: "A mobile shop management system for a phone and accessory business, running on the shop's laptop and on a phone, with customized bill printing on a thermal printer."
      logo: "/images/clients/red-zone.webp"
      image:
        src: "/images/projects/redzone-2.jpg"
        alt: "The Red Zone POS dashboard open on a laptop and on a phone, on the counter of the shop"
        focus: "50% 68%"

    - name: "Royal Foreign City"
      sector: "Imported goods"
      location: "Eravur"
      summary: "A point-of-sale system at the shop counter, with itemized receipts in the shop's own layout that show each discount."
      logo: "/images/clients/royal-foreign-city.webp"
      image:
        src: "/images/projects/rfc-3.jpg"
        alt: "The Royal Foreign City point-of-sale screen on the shop's counter computer, with shelves of imported goods behind it"
        focus: "50% 45%"

    - name: "Apple Fix Solutions"
      sector: "Mobile phone service and training"
      location: "Eravur"
      summary: "A shop management system for a phone service and training centre, running at the service counter."
      logo: "/images/clients/apple-fix.webp"
      image:
        src: "/images/projects/applefix-3.jpg"
        alt: "The Apple Fix Solutions shopfront and signboard on Main Street, Eravur"
        focus: "50% 22%"

    - name: "Rainbow Super"
      sector: "Grocery"
      location: "Eravur"
      summary: "Counter billing for a neighbourhood grocery shop."
      logo: "/images/clients/rainbow-super.webp"
      image:
        src: "/images/projects/rainbow-1.jpg"
        alt: "The Rainbow Super shopfront at dusk, lit from inside"
        focus: "78% 45%"

    - name: "Suthais Foreign Mart"
      sector: "Foreign goods and home appliances"
      location: "Meeravodai"
      summary: "A point-of-sale system with barcode scanning and receipt printing, and each customer's balance shown on their bill."
      logo: "/images/clients/suthais-mart.webp"
      image:
        src: "/images/projects/suthais-2.jpg"
        alt: "Scanning a product's barcode at the Suthais Foreign Mart counter, with the point-of-sale screen behind"
        focus: "50% 55%"

    # No photograph supplied yet: the picture is the shop's own logo.
    - name: "Sofa City"
      sector: "Furniture"
      location: "Eravur"
      summary: "A billing system for a furniture shop."
      logo: "/images/clients/sofa-city.webp"
      image:
        src: "/images/projects/sofa-city.jpg"
        alt: "The Sofa City logo: an armchair, a side table and a lamp"
        focus: "50% 15%"

    # Logo supplied by the owner on 2026-10-06 without the business's name.
    # "YN" is the lettering on the logo: replace it with the real name. It is
    # only read out by screen readers; visitors see the logo.
    - name: "YN"
      logo: "/images/clients/yn.webp"

    # The name is as it is written on the logo.
    - name: "Origin Design & Construction"
      logo: "/images/clients/origin-design-construction.webp"

## FINAL CTA ####################################################################
# Answers: how do I contact you?
final_cta:
  title: "Let's build the system your business actually needs."
  content: "Tell us how your business works, what is difficult today, and what you want the system to handle."
  button:
    label: "Request a Demo"
    link: "whatsapp"

## FOOTER #######################################################################
locations:
  places:
    - "Eravur"
    - "Oddamavadi"
    - "Velikanda"
    - "Batticaloa"
  languages:
    - "Tamil"
    - "English"
    - "Sinhala"
---
