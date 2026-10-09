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
  # `<br>` starts a new line in the headline. `&nbsp;` is a space that never
  # breaks: it keeps "be too." together, so on a phone the last word is not
  # left on a line by itself.
  title: "Your business is unique.<br>Your software should be&nbsp;too."
  # The picture is an illustration supplied by the owner (2026-10-07): a
  # designed dashboard with sample names and figures, not a client's system.
  # So the alt text calls it an illustration and the caption names no client.
  media:
    image: "/images/about/systems-overview.webp"
    alt: "An illustration of a business system: a main dashboard surrounded by panels for point of sale, sales, inventory, customers, purchasing, payments and analytics"
    caption: "From sales and inventory to purchasing, payments and reporting, every system is designed around the needs of the business using it."
  # One supporting sentence beside the picture.
  paragraphs:
    - "We build practical business systems around the way you already work — adapting the software to your operations, not forcing your business into a template."

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
  # Shown under the logos. This is the owner's own count of customers (given
  # 2026-10-07) and the one number on the page: only the owner changes it,
  # and it must stay true.
  customers:
    title: "25+ real customers"
  # The clients, shown as a carousel of tiles: four at a time, changing every
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

    - name: "Hanz Scento"
      logo: "/images/clients/hanz-scento.webp"

    - name: "Lumera Boutique"
      logo: "/images/clients/lumera-boutique.webp"

    - name: "Baby Shopz"
      logo: "/images/clients/baby-shopz.webp"

    - name: "RSP Electrics"
      logo: "/images/clients/rsp-electrics.webp"

    - name: "Happy Corner"
      logo: "/images/clients/happy-corner.webp"

    - name: "S&Z Financial"
      logo: "/images/clients/sz-financial.webp"

    - name: "Y2K Rice Port"
      logo: "/images/clients/y2k-rice-port.webp"

    - name: "Extra Restaurant"
      logo: "/images/clients/extra-restaurant.webp"

    - name: "AM Burger Shop"
      logo: "/images/clients/am-burger-shop.webp"

    - name: "Apex Auto Care"
      logo: "/images/clients/apex-auto-care.webp"




## FINAL CTA ####################################################################
# The closing statement. `<br>` starts a new line in the headline.
# There is no button here (removed at the owner's request): the ways to reach
# us are in the footer directly below. To bring one back, add
#   button:
#     label: "Request a Demo"
#     link: "whatsapp"
final_cta:
  title: "Have a business?<br>We’ll build the website around it."
  content: "From your brand and products to the way your customers interact with you."

## FOOTER #######################################################################
locations:
  # The main place, shown as a card that opens to a drawn map when clicked.
  #   coordinates - shown once the card is open. These are the town's, to
  #                 the nearest minute, not a street address.
  #   tag         - the small pill in the card's corner.
  #   hint        - appears under the card while it is pointed at.
  card:
    name: "Eravur"
    coordinates: "7°46′ N, 81°36′ E"
    tag: "Sri Lanka"
    hint: "Click to expand"
  # The other places, listed under the card (owner's list, 2026-10-07).
  # Until then the footer listed Eravur, Oddamavadi, Velikanda and Batticaloa.
  places:
    - "Jaffna"
    - "Vavuniya"
    - "Kilinochchi"
  languages:
    - "Tamil"
    - "English"
    - "Sinhala"
---
