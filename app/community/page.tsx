import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f4ef]">
      {/* Header */}
    

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
                <span className="text-white/90 text-sm font-medium tracking-wide">Our Community</span>
                <div className="w-12 h-px bg-white/60"></div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Community Life
              </h1>
              <p className="text-white/90 text-lg max-w-4xl mx-auto leading-relaxed">
                Welcome to Our Church, where we are dedicated to fostering a vibrant and nurturing environment for our
                members to flourish spiritually and forge meaningful connections within their faith community. Explore
                the array of activities and events we have in store for you, designed to enrich your journey of faith
                and fellowship. Join us as we embark on this inspiring and uplifting path together.
              </p>
            </div>
          </div>
        </section>

        {/* Holy Mass Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/images/holy-mass-service.jpg"
                  alt="Holy Mass celebration in Malankara Catholic Church with ornate iconostasis, clergy in white vestments, and congregation"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-[20px] shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">Worship</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">Holy Mass</h2>
                <p className="text-gray-600 leading-relaxed">
                  Join us every Sunday as we come together to attend the Holy Mass. Our dedicated priest celebrates the
                  Malankara Catholic liturgy according to the liturgical calendar. During special occasions like Easter
                  and Christmas, we host additional services and liturgical celebrations as directed by the Malankara
                  Catholic Church.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catechism Section */}
        <section className="py-16 bg-[#F5F1EB]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">Education</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">Catechism</h2>
                <p className="text-gray-600 leading-relaxed">
                  We offer comprehensive catechism classes based on the academic syllabus of the Malankara Catholic
                  Diocese. Children have the opportunity to learn about the Christian faith and teachings of the Bible
                  through our weekly catechism sessions, conducted either online or in person.
                </p>
              </div>
              <div className="relative order-1 lg:order-2">
                <Image
                  src="/images/catechism-children.jpg"
                  alt="Children and young people from catechism classes gathered in the church sanctuary with teachers and parents"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-[20px] shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Prayer Meetings Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/images/prayer-meeting.jpg"
                  alt="Community prayer meeting with priest in traditional vestments leading a group of parishioners in an intimate gathering"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-[20px] shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">Fellowship</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">Prayer Meetings</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our monthly prayer meetings provide a space for spiritual reflection and community bonding. We engage
                  in various activities such as Rosary prayers, Bible readings, reflections, songs, and prayers,
                  followed by refreshments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MCYM Section */}
        <section className="py-16 bg-[#F5F1EB]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">Youth Ministry</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  Malankara Catholic Youth Movement (MCYM)
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Our vibrant youth association, known as the Malankara Catholic Youth Movement (MCYM), boasts over 25
                  active members. They organize workshops, camps, and other activities focused on faith formation and
                  spiritual growth.
                </p>
              </div>
              <div className="relative order-1 lg:order-2">
                <Image
                  src="/images/mcym-youth-group.jpg"
                  alt="Vibrant group of MCYM youth members gathered outside the church in traditional and modern attire, representing the active Malankara Catholic Youth Movement"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-[20px] shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mothers Forum Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/images/mothers-forum.jpg"
                  alt="Mothers Forum members in traditional Indian attire receiving certificates from the priest, showcasing their active participation in church activities and community service"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-[20px] shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">Women's Ministry</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">Mothers Forum</h2>
                <p className="text-gray-600 leading-relaxed">
                  With over 40 dedicated members, our Mothers Forum plays an integral role in the church's day-to-day
                  operations. From organizing refreshments to hosting seminars and workshops, they foster a sense of
                  community and family values among our members.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid Section */}
        <section className="py-16 bg-[#F5F1EB]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">
                Community Activities & Events
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Throughout the year, we organize various activities and events that bring our community together in
                faith, fellowship, and celebration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Annual Summer Retreat */}
              <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/summer-retreat.jpg"
                    alt="Large congregation gathered in beautiful modern church sanctuary during annual summer retreat with vaulted wooden ceiling and professional sound setup"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Annual Summer Retreat</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Take part in our rejuvenating summer retreat, held over 2 to 3 days in the evenings. Featuring
                    adoration, praise and worship, and Bible study sessions, this retreat offers a time of spiritual
                    renewal and growth.
                  </p>
                </div>
              </div>

              {/* Children's Social Cultural Meet */}
              <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/children-cultural-meet.jpg"
                    alt="Children engaged in social cultural activities in a decorated classroom setting with colorful bunting and organized seating"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Children's Social Cultural Meet</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Engage your children in fun activities and games at our social cultural meets, fostering friendships
                    and community bonds.
                  </p>
                </div>
              </div>

              {/* Pilgrimage Visit */}
              <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/pilgrimage-visit.jpg"
                    alt="Large community group gathered at a sacred pilgrimage site with white stone religious monument and statues surrounded by lush greenery"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Pilgrimage Visit</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Embark on a spiritual journey with our pilgrimage visits to sacred sites, fostering deeper
                    connections with our faith and heritage.
                  </p>
                </div>
              </div>

              {/* Annual Picnic Day */}
              <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/images/annual-picnic.jpg"
                    alt="Large community gathering of families and children enjoying fellowship at annual picnic in beautiful green park setting with lush trees"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Annual Picnic Day</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Join us for a day of fun and fellowship at our annual picnic held in the local community park. Enjoy
                    delicious food, BBQ, games, and engaging conversations as we strengthen our bonds and create
                    cherished memories.
                  </p>
                </div>
              </div>

              {/* Cultural Festivals */}
              <div className="bg-white rounded-[20px] shadow-sm overflow-hidden md:col-span-2 lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-miDRW9RrVaPULcKEX1u0pNpYWXYBQd.png"
                      alt="Large community gathering celebrating cultural festival outside the church with families in traditional Indian attire during evening celebration"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Cultural Festivals</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Experience the vibrant traditions of cultural festivals like Onam, celebrating our rich heritage
                      and diversity. These celebrations bring together our community to honor our cultural roots while
                      strengthening our bonds of fellowship and faith.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
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
