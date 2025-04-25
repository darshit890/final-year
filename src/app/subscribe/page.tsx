import { NewsletterSubscription } from '@/components/newsletter-subscription'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-slate-800 dark:text-slate-200">
          Join Our Newsletter
        </h1>
        
        <NewsletterSubscription />
      </div>
    </div>
  )
}