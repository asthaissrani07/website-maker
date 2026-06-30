import type { SiteContent } from "@/components/product/ProductSiteContext";

export function privacyPolicyBody(config: SiteContent): string {
  return `Privacy Policy — ${config.brandName}

Last updated: ${new Date().toLocaleDateString()}

We respect your privacy. This policy explains how ${config.brandName} ("we", "us") collects and uses information when you visit our website or purchase ${config.productName}.

Information we collect
• Account details (name, email) when you sign up
• Order and payment contact information at checkout
• Messages you send through our contact form
• Newsletter email if you subscribe

How we use your information
• To process orders and provide customer support
• To send order updates and respond to inquiries
• To improve our products and website experience

Your rights
You may request access to or deletion of your data by contacting us at ${config.contactEmail}.

Contact
${config.contactEmail}
${config.brandName}`;
}

export function termsOfServiceBody(config: SiteContent): string {
  return `Terms of Service — ${config.brandName}

Last updated: ${new Date().toLocaleDateString()}

By using this website and purchasing ${config.productName}, you agree to these terms.

Products & pricing
All prices are shown in USD unless stated otherwise. We reserve the right to update pricing and product availability.

Orders
When you place an order, you receive a confirmation email and order number. Delivery estimates are provided at checkout and on your order details page.

Returns
See our refund policy for satisfaction guarantee details. Contact ${config.contactEmail} for return requests.

Limitation of liability
${config.brandName} provides products "as described." We are not liable for indirect damages arising from use of our products beyond applicable consumer law.

Contact
Questions about these terms: ${config.contactEmail}`;
}

export function refundPolicyBody(config: SiteContent): string {
  return `Refund Policy — ${config.brandName}

We offer a 30-day satisfaction guarantee on ${config.productName}. If you're not happy with your purchase, contact ${config.contactEmail} with your order number within 30 days of delivery.

Unopened items qualify for a full refund. Opened items may be eligible for store credit at our discretion.

Refunds are processed within 5–10 business days after approval.`;
}
