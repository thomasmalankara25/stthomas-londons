import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { ImageSlider } from "@/components/image-slider"

const galleryImages = [
  {
    src: "/images/gallery/clergy-ceremony.jpg",
    alt: "Clergy members in golden vestments during religious ceremony with young participants holding candles",
  },
  {
    src: "/images/gallery/church-interior.jpg",
    alt: "Church interior with crucifix and priest speaking at podium during service",
  },
  {
    src: "/images/gallery/outdoor-procession.jpg",
    alt: "Clergy members in white and green vestments during outdoor religious procession",
  },
  {
    src: "/images/gallery/church-service.jpg",
    alt: "Clergy members in white vestments during church service",
  },
  {
    src: "/images/gallery/altar-group.jpg",
    alt: "Group photo of clergy and congregation members around ornately decorated altar with flowers",
  },
]

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f4ef]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src="/images/malankara-logo.png"
                  alt="Malankara Catholic Church Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-[#8B6F47] tracking-wider">St. Thomas Malankara</div>
                <div className="text-xs text-[#8B6F47] tracking-[0.2em] font-medium">CATHOLIC CHURCH</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              HOME
            </Link>
            <Link href="/about" className="text-[#8B6F47] text-sm font-medium tracking-wide">
              ABOUT US
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              COMMUNITY
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              EVENTS
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              NEWS
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-4 md:px-6 py-2 text-sm font-medium tracking-wide rounded-sm hidden md:block">
              DONATE FUND
            </Button>
            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-[#a67c52] py-16 md:py-24 overflow-hidden">
          {/* Overlay pattern on the right side */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <Image
              src="/images/lines-overlay-pattern.png"
              alt=""
              fill
              className="object-cover object-center"
              style={{ mixBlendMode: "overlay" }}
            />
          </div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-px bg-white/60"></div>
                <span className="text-white/90 text-sm font-medium tracking-wide">About Us</span>
                <div className="w-12 h-px bg-white/60"></div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Our Story & Heritage
              </h1>
              <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
                Discover the rich history and spiritual journey of the Syro-Malankara Catholic Church, rooted in ancient
                traditions and united in faith.
              </p>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Text Content */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-px bg-[#A67C52]"></div>
                    <span className="text-[#A67C52] text-sm font-medium tracking-wide">Our Heritage</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">Our History</h2>
                </div>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    The Syro-Malankara Catholic Church is an Eastern Catholic Church based in Kerala, India. The church
                    has its roots in the Malankara Church, which was founded in the 1st century by St. Thomas the
                    Apostle. The Malankara Church was originally part of the Assyrian Church of the East, but it
                    gradually became more influenced by Syriac Christianity.
                  </p>

                  <p>
                    In the 16th century, the Malankara Church came into contact with the Portuguese, who brought Roman
                    Catholicism to India. Some members of the Malankara Church converted to Roman Catholicism, but many
                    others resisted and formed their own church, known as the Malankara Orthodox Syrian Church.
                  </p>

                  <p>
                    In the early 20th century, a group of Malankara Orthodox Christians sought to reunite with the
                    Catholic Church. In 1930, they were received into the Catholic Church by Pope Pius XI and formed the
                    Syro-Malankara Catholic Church. The church maintains its own distinct liturgical and spiritual
                    traditions, which are based on the Syriac tradition.
                  </p>

                  <p>
                    The Syro-Malankara Catholic Church has grown significantly in recent years, both in India and around
                    the world. Today, the church has around 500,000 members, with the majority living in Kerala. The
                    church is led by a Major Archbishop, who is based in the city of Trivandrum.
                  </p>
                </div>
              </div>

              {/* Image Slider */}
              <div className="lg:sticky lg:top-8">
                <ImageSlider images={galleryImages} />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-16 bg-[#F5F1EB]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">Our Mission & Values</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                We are committed to preserving our ancient traditions while serving our community with love and
                compassion.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[20px] shadow-sm text-center">
                <div className="w-16 h-16 bg-[#A67C52] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Sacred Tradition</h3>
                <p className="text-gray-600 leading-relaxed">
                  Preserving and celebrating our ancient Syriac liturgical traditions passed down through generations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[20px] shadow-sm text-center">
                <div className="w-16 h-16 bg-[#A67C52] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Community Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Serving our community with love, compassion, and dedication to social justice and spiritual growth.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[20px] shadow-sm text-center">
                <div className="w-16 h-16 bg-[#A67C52] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Global Unity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connecting faithful communities worldwide while maintaining our unique Eastern Catholic identity.
                </p>
              </div>
            </div>
          </div>
                 
        </section>
          <section className="py-16 bg-gray-900 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40 blur-sm">
              <source
                src="https://thomasbucket26.s3.us-east-2.amazonaws.com/5875505-uhd_3840_2160_24fps+(online-video-cutter.com).mov"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="container relative z-10">
            <h2 className="mb-6 text-2xl font-semibold text-white md:text-4xl">Join Our Community</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Be part of our growing church family and experience the joy of fellowship, spiritual growth, and service.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm">
                  REGISTER NOW
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-[#a67c52] border-white hover:bg-white/20 px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm bg-transparent"
              >
                DONATE FUND
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
