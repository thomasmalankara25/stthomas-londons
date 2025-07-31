"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Facebook, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { newsService } from "@/lib/api/news"
import type { News } from "@/lib/supabase"

export default function NewsArticle({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<News | null>(null)
  const [relatedNews, setRelatedNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadArticle()
  }, [params.id])

  const loadArticle = async () => {
    try {
      setIsLoading(true)
      const articleData = await newsService.getById(Number.parseInt(params.id))

      if (articleData && articleData.status === "published") {
        setArticle(articleData)

        // Load related articles from the same category
        const relatedArticles = await newsService.getByCategory(articleData.category)
        // Filter out current article and limit to 3
        const filtered = relatedArticles.filter((item) => item.id !== articleData.id).slice(0, 3)
        setRelatedNews(filtered)
      } else {
        setError("Article not found or not published")
      }
    } catch (error) {
      console.error("Error loading article:", error)
      setError("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const shareArticle = (platform: string) => {
    const url = window.location.href
    const title = article?.title || ""

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#f8f4ef]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/malankara-logo.png"
                alt="Malankara Catholic Church logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider text-[#8B6F47]">St. Thomas Malankara</span>
                <span className="text-xs font-medium tracking-[0.2em] text-[#8B6F47]">CATHOLIC CHURCH</span>
              </div>
            </Link>
            <MobileMenu />
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-4">
              <Link href="/news">
                <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">Back to News</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/malankara-logo.png"
              alt="Malankara Catholic Church logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider text-[#8B6F47]">St. Thomas Malankara</span>
              <span className="text-xs font-medium tracking-[0.2em] text-[#8B6F47]">CATHOLIC CHURCH</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              HOME
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              ABOUT US
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              COMMUNITY
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-[#8B6F47] text-sm font-medium tracking-wide">
              EVENTS
            </Link>
            <Link href="/news" className="text-[#8B6F47] text-sm font-medium tracking-wide">
              NEWS
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button className="hidden rounded-sm bg-[#A67C52] px-4 py-2 text-sm font-medium tracking-wide text-white hover:bg-[#8B6F47] md:block md:px-6">
              DONATE FUND
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Breadcrumb */}
        <section className="bg-white py-4 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#A67C52]">
                Home
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-[#A67C52]">
                News
              </Link>
              <span>/</span>
              <span className="text-gray-800">{article.title}</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-[#A67C52] hover:text-[#8B6F47] font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </Link>
              </div>

              {/* Article Header */}
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-block bg-[#A67C52] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By {article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">{article.description}</p>

                {/* Share Buttons */}
                <div className="flex items-center gap-4 pb-8 border-b">
                  <span className="text-sm font-medium text-gray-700">Share this article:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareArticle("facebook")}
                      className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareArticle("twitter")}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareArticle("email")}
                      className="text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {article.image_url && (
                <div className="mb-8">
                  <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</div>
              </div>

              {/* Article Footer */}
              <footer className="border-t pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Share:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareArticle("facebook")}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareArticle("twitter")}
                        className="text-blue-400 hover:bg-blue-50"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    </div>
                  </div>

                  <Link href="/news">
                    <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white">View All News</Button>
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <section className="py-12 bg-[#F5F1EB]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Related Articles</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {relatedNews.map((relatedArticle) => (
                    <Link key={relatedArticle.id} href={`/news/${relatedArticle.id}`}>
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-48">
                          <Image
                            src={relatedArticle.image_url || "/placeholder.svg?height=200&width=400"}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-[#A67C52] px-3 py-1 text-xs font-medium text-white">
                            {relatedArticle.category}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(relatedArticle.published_at || relatedArticle.created_at)}</span>
                          </div>

                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-[#A67C52] transition-colors">
                            {relatedArticle.title}
                          </h3>

                          <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
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
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">Stay Updated with Church News</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Don't miss out on the latest updates and stories from our church community.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/news">
                <Button className="bg-[#A67C52] hover:bg-[#8B6F47] text-white px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm">
                  VIEW ALL NEWS
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-6 py-2.5 text-sm font-medium tracking-wide rounded-sm"
                >
                  BACK TO HOME
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <p className="mb-6 text-gray-300">
                Connect with our church for all updates and information. Follow us on social media and subscribe to our
                newsletter.
              </p>
              <div className="flex gap-4">
                {["Facebook", "Instagram", "Twitter"].map((label) => (
                  <Link
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c49a6c] hover:bg-[#b38a5c]"
                  >
                    <span className="sr-only">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
