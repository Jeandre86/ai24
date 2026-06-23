import React from 'react';

export function Privacy() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary font-sora">Privacy Policy</h1>
        <p className="text-secondary">Last updated: June 2026</p>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Introduction</h2>
        <p className="text-secondary leading-relaxed">
          At Mosaic, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-primary mb-2">Personal Information</h3>
            <p className="text-secondary">
              When you create an account, we collect your email address, name, and any preferences you set. This information is used to authenticate your account and personalize your experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-2">Usage Data</h3>
            <p className="text-secondary">
              We collect information about how you interact with Mosaic, including articles you read, preferences you save, and searches you perform. This helps us improve our service and provide better recommendations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-2">Device Information</h3>
            <p className="text-secondary">
              We may collect information about your device, browser, IP address, and operating system to ensure compatibility and security.
            </p>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">How We Use Your Information</h2>
        <ul className="space-y-2 text-secondary list-disc list-inside">
          <li>To provide, maintain, and improve our services</li>
          <li>To personalize your experience and content recommendations</li>
          <li>To send you updates about new features or changes to our service</li>
          <li>To respond to your inquiries and support requests</li>
          <li>To analyze usage patterns and improve our platform</li>
          <li>To detect and prevent fraudulent activity</li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Data Security</h2>
        <p className="text-secondary leading-relaxed">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      {/* Third-Party Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Third-Party Services</h2>
        <p className="text-secondary leading-relaxed">
          Mosaic uses Firebase for authentication and data storage. We also aggregate news content from various public sources including Hacker News and other tech news platforms. We encourage you to review their privacy policies as well.
        </p>
      </section>

      {/* Your Rights */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">Your Privacy Rights</h2>
        <p className="text-secondary leading-relaxed mb-4">
          Depending on your location, you may have the following rights:
        </p>
        <ul className="space-y-2 text-secondary list-disc list-inside">
          <li>The right to access your personal data</li>
          <li>The right to correct inaccurate data</li>
          <li>The right to request deletion of your data</li>
          <li>The right to opt-out of marketing communications</li>
          <li>The right to data portability</li>
        </ul>
      </section>

      {/* Contact Us */}
      <section className="p-6 bg-surface rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-3 text-primary font-sora">Contact Us</h2>
        <p className="text-secondary mb-2">
          If you have questions about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <p className="text-primary font-semibold">hello@mosaicnews.co.za</p>
      </section>
    </main>
  );
}
