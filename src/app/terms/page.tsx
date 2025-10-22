import { Layout } from '@/components/layout/layout'

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-800 font-medium">
              Last updated: {new Date().toLocaleDateString('en-PK', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-blue-700 mt-2">
              Please read these terms and conditions carefully before using our service.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using MobileShop ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on MobileShop for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product information, including descriptions, prices, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            <p className="text-gray-700 mb-4">
              All products are subject to availability. We reserve the right to discontinue any product at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Payment</h2>
            <p className="text-gray-700 mb-4">
              All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice. We reserve the right to modify prices at any time.
            </p>
            <p className="text-gray-700 mb-4">
              Payment must be made in full at the time of purchase. We accept various payment methods including credit cards, debit cards, and bank transfers through secure payment gateways.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Order Processing and Delivery</h2>
            <p className="text-gray-700 mb-4">
              All orders are subject to acceptance and availability. We will send you an order confirmation email once your order has been processed.
            </p>
            <p className="text-gray-700 mb-4">
              Delivery times are estimates and may vary depending on your location and product availability. We are not responsible for delays caused by third-party delivery services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              We offer a 7-day return policy for most products, provided they are in original condition with all accessories and packaging intact.
            </p>
            <p className="text-gray-700 mb-4">
              Refunds will be processed within 5-7 business days after we receive the returned item. Shipping costs for returns are the responsibility of the customer unless the return is due to our error.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Order Cancellation</h2>
            <p className="text-gray-700 mb-4">
              Orders can be cancelled within 24 hours of placement without any charges. For cancellations after 24 hours, the following cancellation fees apply:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Orders below PKR 50,000: PKR 3,000 cancellation fee</li>
              <li>Orders between PKR 50,000 - PKR 80,000: PKR 5,000 cancellation fee</li>
              <li>Orders between PKR 80,000 - PKR 150,000: PKR 8,000 cancellation fee</li>
              <li>Orders above PKR 150,000: PKR 10,000 cancellation fee</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Once an order has been shipped, it cannot be cancelled and must be returned following our return policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Warranty</h2>
            <p className="text-gray-700 mb-4">
              All products come with manufacturer warranties as specified by the brand. We are not responsible for warranty claims beyond what is provided by the manufacturer.
            </p>
            <p className="text-gray-700 mb-4">
              For warranty claims, customers must contact the manufacturer directly or visit an authorized service center.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall MobileShop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Pakistan and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700"><strong>Email:</strong> support@mobileshop.pk</p>
              <p className="text-gray-700"><strong>Phone:</strong> +92-XXX-XXXXXXX</p>
              <p className="text-gray-700"><strong>Address:</strong> Karachi, Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
