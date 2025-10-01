"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EventsCarousel } from "@/components/events-carousel"
import { NewsCarousel } from "@/components/news-carousel"
import { newsService } from "@/lib/api/news"
import type { News } from "@/lib/supabase"
import { eventsService } from "@/lib/api/events"
import type { Event } from "@/lib/supabase"
import { massService } from "@/lib/api/mass"
import type { MassSettings } from "@/lib/supabase"
import { formatDateForDisplay } from "@/lib/utils"
import { motion } from "framer-motion"
import { AnimatedWrapper } from "@/components/animated-wrapper"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedGrid } from "@/components/animated-grid"
import { Calendar, MapPin, Mail, Building2 } from "lucide-react"
import {
  heroImageVariants,
  slideInLeftVariants,
  slideInRightVariants,
  cardHoverVariants,
  buttonVariants,
  floatingVariants,
} from "@/lib/animations"

export default function Home() {
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [massSettings, setMassSettings] = useState<MassSettings | null>(null)
  const [isLoadingMass, setIsLoadingMass] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoadingNews(true)
      setIsLoadingEvents(true)
      setIsLoadingMass(true)

      const [newsData, eventsData, massData] = await Promise.all([
        newsService.getPublished(), 
        eventsService.getUpcoming(),
        massService.getSettings()
      ])

      // Get all news articles for the carousel
      setLatestNews(newsData)
      // Get all upcoming events
      setUpcomingEvents(eventsData)
      // Get mass settings
      setMassSettings(massData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoadingNews(false)
      setIsLoadingEvents(false)
      setIsLoadingMass(false)
    }
  }

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString)
  }

  const formatEventDate = (dateString: string) => {
    return formatDateForDisplay(dateString)
  }

  useEffect(() => {
    const handleResize = () => {
      setCurrentSlide(0)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <AnimatedWrapper className="flex flex-col min-h-screen bg-[#f8f4ef]">

      <main>
        {/* Hero Section */}
        <section className="relative bg-[#F5F1EB] overflow-hidden">
          {/* Video background with blur effect */}
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover blur-sm">
              <source
                src="https://thomasbucket26.s3.us-east-2.amazonaws.com/WhatsApp+Video+2025-10-01+at+02.06.42_4ac872b1.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Darker gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-[1]"></div>

          {/* Brown background section with overlay pattern */}
          <motion.div
            className="absolute top-0 right-0 hidden md:block md:w-1/3 h-full bg-[#A67C52]"
            style={{ zIndex: 9 }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
          >
            <div className="absolute inset-0 opacity-30">
              <Image
                src="/images/lines-overlay-pattern.png"
                alt=""
                fill
                className="object-cover object-center"
                style={{ mixBlendMode: "overlay" }}
              />
            </div>
          </motion.div>

          <div className="container mx-auto px-2 py-2 md:px-4 md:py-4 lg:py-6 relative z-20">
            <div className="grid lg:grid-cols-2  lg:gap-22 items-center mb-0">
              {/* Image section */}
              <motion.div
                className="relative flex justify-center order-1 lg:order-2 lg:justify-end lg:mb-0 hidden md:flex"
                variants={heroImageVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[650px] lg:h-[650px]"
                  
                  animate="animate"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="https://thomasbucket26.s3.us-east-2.amazonaws.com/image12.png"
                      alt="Jesus Christ in prayer - kneeling in white robes with hands clasped"
                      fill
                      style={{position: "absolute", height: "100%", width: "100%", left: "11%", top: "5%", right: "0", bottom: "0", objectPosition: "center 25%", color: "transparent"}}
                      className="object-cover object-center"
                      
                      priority
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Text content */}
              <motion.div
                className="space-y-6 md:space-y-8 max-w-lg mx-auto md:text-left text-center order-2 lg:order-1 px-6 md:px-8 py-8 md:py-12 flex flex-col md:items-start items-center w-full"
                variants={slideInLeftVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex items-center justify-center lg:justify-start gap-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="w-8 md:w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#D4B896] text-sm font-medium tracking-wide">We Believe in God</span>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl md:w-[130%] font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  St. Thomas Malankara Catholic Church
                </motion.h1>

                <motion.p
                  className="text-gray-100 text-base md:width-[110%]md:text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  Malankara Catholic Church is one of the oriental Catholic rites of the Catholic Church, based in
                  Kerala, India. It belongs to the Antiochian liturgical family formed by the reunion movement with the
                  Universal Catholic Church by the Malankara Orthodox bishop Mar Ivanios in 1930.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <Link href="/register">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-6 py-2.5 md:px-8 md:py-3 text-sm font-medium tracking-wide rounded-sm">
                        REGISTER WITH US
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <AnimatedSection className="py-16 bg-[#F5F1EB]">
          <div className="container mx-auto px-8 md:px-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image section */}
              <motion.div
                className="relative"
                variants={slideInLeftVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="relative w-full max-w-[500px] mx-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/jesus-teaching.jpg"
                    alt="Jesus Christ teaching his disciples"
                    width={500}
                    height={350}
                    className="w-full h-auto object-cover rounded-[40px]"
                  />
                </motion.div>
              </motion.div>

              {/* Text content */}
              <motion.div
                className="space-y-6"
                variants={slideInRightVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-12 h-px bg-[#A67C52]"></div>
                  <span className="text-[#A67C52] text-sm font-medium tracking-wide">About Us</span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Rooted in Faith, United in Love
                </motion.h2>

                <motion.div
                  className="space-y-4 text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p>
                    We are a community of faithful Catholics who follow the Syro-Malankara Rite, which is rooted in the
                    ancient traditions of the East. Our church is committed to fostering spiritual growth, deepening our
                    faith, and spreading the love of Christ to all who seek it.
                  </p>
                  <p>
                    As a vibrant and diverse community, we offer a range of services and programs that cater to the
                    needs of all our members, regardless of age, background or ethnicity.
                  </p>
                </motion.div>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Link href="/about">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-8 py-3 text-sm font-medium tracking-wide rounded-sm">
                        READ MORE
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Community Service Section */}
        <AnimatedSection className="py-16 bg-white">
          <div className="container mx-auto px-8 md:px-16">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-px bg-[#A67C52]"></div>
                <span className="text-[#A67C52] text-sm font-medium tracking-wide">Our Services</span>
                <div className="w-12 h-px bg-[#A67C52]"></div>
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Keeping Our Church Running Smoothly
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our dedicated team of volunteers and staff work tirelessly behind the scenes to ensure a seamless and
                enriching experience for our congregation.
              </motion.p>
            </motion.div>

            {/* Service Cards */}
            <AnimatedGrid className="grid md:grid-cols-3 gap-8 mb-12" staggerDelay={0.2}>
              {[
                {
                  icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo7-6YfvMUamfL6dYfeD0bXoFWEWvDxxmj.png",
                  title: "Holy Mass",
                  description:
                    "Join us every Sunday for Holy Mass in the Malankara Catholic tradition. We also hold special services for Easter, Christmas, and other feast days as guided by the Church calendar.",
                },
                {
                  icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo8-xhPxka6RrqmTOlUGzMa5kzbAgVYNGe.png",
                  title: "MCCL",
                  description:
                    "Our monthly prayer meetings offer spiritual reflection and fellowship through Rosary, Bible readings, songs, and prayers, followed by light refreshments and community bonding.",
                },
                {
                  icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo9-6S7okpqnbAhalrdy5ihLYqXzorEsyV.png",
                  title: "Catechism",
                  description:
                    "We offer weekly catechism classes, online or in person, following the Malankara Catholic Diocese syllabus, helping children grow in faith and understand the teachings of the Bible.",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-[#F5F1EB] p-8 rounded-lg text-center"
                  variants={cardHoverVariants}
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="mb-6 flex justify-center"
                   
                    transition={{ duration: 0.8 }}
                  >
                    <Image
                      src={service.icon || "/placeholder.svg"}
                      alt={`${service.title} icon`}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </AnimatedGrid>

            {/* View More Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/community">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-8 py-3 text-sm font-medium tracking-wide rounded-sm">
                    VIEW MORE
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Mass Information Section */}
        <AnimatedSection className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-px bg-[#A67C52]"></div>
                <span className="text-[#A67C52] text-sm font-medium tracking-wide">Mass Schedule</span>
                <div className="w-12 h-px bg-[#A67C52]"></div>
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join Us for Holy Mass
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Experience the sacred liturgy and spiritual fellowship at our church.
              </motion.p>
            </motion.div>

            {isLoadingMass ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <p className="text-gray-600">Loading mass information...</p>
              </motion.div>
            ) : massSettings ? (
              <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  {/* Priest Image */}
                  <motion.div
                    className="lg:col-span-1 flex justify-center lg:justify-start"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="relative w-64 h-80 lg:w-72 lg:h-96">
                      <Image
                        src="/images/rev-fr-jobin-thomas.png"
                        alt="Rev. Fr. Jobin Thomas - Parish Priest"
                        fill
                        className="object-cover object-center rounded-2xl shadow-lg"
                        style={{ objectPosition: "center top" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-lg">Rev. Fr. Jobin Thomas</h4>
                        <p className="text-sm opacity-90">Parish Priest</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mass Information Cards */}
                  <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                    {/* Church Information */}
                    <motion.div
                      className="bg-[#f8f4ef] p-6 rounded-2xl border border-[#A67C52]/20"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#A67C52] rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Church Information</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-[#A67C52] mb-1">Church Name</p>
                          <p className="text-gray-700">{massSettings.church_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#A67C52] mb-1">Contact Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#A67C52]" />
                            <p className="text-gray-700">{massSettings.email}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mass Schedule */}
                    <motion.div
                      className="bg-[#f8f4ef] p-6 rounded-2xl border border-[#A67C52]/20"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#A67C52] rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Mass Schedule</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-[#A67C52] mb-1">Sunday Mass Time</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#A67C52]" />
                            <p className="text-gray-700 text-lg font-medium">{massSettings.mass_time}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#A67C52] mb-1">Church Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#A67C52] mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{massSettings.address}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Call to Action */}
                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link href="/community">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">
                        Learn More About Our Community
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-gray-500 text-lg mb-4">Mass information not available at the moment.</p>
                <p className="text-gray-400">Please check back later or contact the church office.</p>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* Upcoming Events */}
        <AnimatedSection className="py-12 bg-[#f8f4ef]">
          <div className="container">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-gray-800 mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Upcoming Events List
            </motion.h2>

            {isLoadingEvents ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <p className="text-gray-600">Loading upcoming events...</p>
              </motion.div>
            ) : upcomingEvents.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-gray-500 text-lg mb-4">No upcoming events at the moment.</p>
                <p className="text-gray-400">Check back soon for new events!</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <EventsCarousel events={upcomingEvents} />
              </motion.div>
            )}

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/events">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button className="bg-[#c49a6c] hover:bg-[#b38a5c] text-white">View All Events</Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* News & Blog Carousel Section */}
        <AnimatedSection className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-px bg-[#A67C52]"></div>
                <span className="text-[#A67C52] text-sm font-medium tracking-wide">Latest News</span>
                <div className="w-12 h-px bg-[#A67C52]"></div>
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Stay Updated with Our Community
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Read the latest news, announcements, and inspiring stories from our church community.
              </motion.p>
            </motion.div>

            {isLoadingNews ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#A67C52] mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <p className="text-gray-600 text-lg">Loading latest news...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <NewsCarousel news={latestNews} />
               
              </motion.div>
            )}

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/news">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-8 py-3 text-sm font-medium tracking-wide rounded-lg">
                    View All News
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
    </AnimatedWrapper>
  )
}
