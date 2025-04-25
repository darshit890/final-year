import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail, TrendingUp, BookOpen, Lightbulb } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedImage } from "@/components/animated-image"
import { AnimatedText } from "@/components/animated-text"
import { AnimatedCard } from "@/components/animated-card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <Image src="/images/pattern-bg.avif" alt="Background pattern" fill className="object-cover" priority />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="text-left" direction="left">
              <AnimatedText
                as="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                delay={0.2}
              >
                Stay Updated with <span className="text-blue-600 dark:text-blue-400">The Byte Highlight</span>
              </AnimatedText>
              <AnimatedText as="p" className="text-xl text-slate-600 dark:text-slate-300 mb-8" delay={0.4}>
                Get the latest tech insights, industry trends, and expert opinions delivered right to your inbox.
              </AnimatedText>
              <div className="flex gap-4">
                <Link href="/articles">
                  <Button size="lg" className="rounded-full px-8 animate-pulse-subtle">
                    Read Articles
                  </Button>
                </Link>
                <Link href="/subscribe">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedImage
              src="/images/newsletter-hero.avif"
              alt="Tech newsletter"
              width={800}
              height={600}
              className="rounded-2xl shadow-xl object-cover h-[400px] w-full"
              priority
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto">
          <AnimatedText
            as="h2"
            className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
            delay={0.1}
          >
            Why Subscribe to Our Newsletter?
          </AnimatedText>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                className="bg-slate-50 dark:bg-slate-700 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                delay={0.2 + index * 0.1}
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-center">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <AnimatedText
            as="h2"
            className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white"
            delay={0.1}
          >
            What Our Subscribers Say
          </AnimatedText>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
                delay={0.2 + index * 0.1}
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">&ldquo{testimonial.quote}&ldquo</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-xl" direction="up">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center animate-float">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <AnimatedText as="h2" className="text-3xl font-bold mb-6 text-slate-900 dark:text-white" delay={0.3}>
              Join Our Newsletter
            </AnimatedText>
            <AnimatedText as="p" className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto" delay={0.4}>
              Subscribe to get weekly updates on the latest tech trends, insights, and exclusive content.
            </AnimatedText>
            <NewsletterSubscription />
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">The Byte Highlight</h3>
              <p className="text-slate-300">Your source for the latest tech news, insights, and trends.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/articles" className="text-slate-300 hover:text-white transition-colors">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Link href="https://twitter.com" className="text-slate-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </Link>
                <Link href="https://linkedin.com" className="text-slate-300 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} The Byte Highlight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Curated Content",
    description:
      "Hand-picked articles and insights from tech experts and industry leaders, carefully selected for relevance and quality.",
    icon: BookOpen,
  },
  {
    title: "Latest Trends",
    description:
      "Stay ahead with updates on emerging technologies and industry developments before they become mainstream.",
    icon: TrendingUp,
  },
  {
    title: "Expert Insights",
    description:
      "Deep dives and analysis from experienced professionals in the field, giving you valuable perspectives.",
    icon: Lightbulb,
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Software Engineer",
    quote:
      "This newsletter has been invaluable for keeping up with the latest tech trends. The curated content saves me hours of research.",
    avatar: "/images/avatar-1.avif",
  },
  {
    name: "Michael Chen",
    title: "Product Manager",
    quote:
      "The insights from industry experts have directly influenced our product roadmap. Highly recommended for any tech professional.",
    avatar: "/images/avatar-2.avif",
  },
  {
    name: "Priya Patel",
    title: "CTO, TechStart",
    quote:
      "I forward The Byte Highlight to my entire team every week. It's become an essential part of our professional development.",
    avatar: "/images/avatar-3.avif",
  },
]
