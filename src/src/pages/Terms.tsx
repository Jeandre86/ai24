import React from 'react';

export function Terms() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary font-sora">Terms of Service</h1>
        <p className="text-secondary">Last updated: June 2026</p>
      </div>

      {/* Acceptance of Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">1. Acceptance of Terms</h2>
        <p className="text-secondary leading-relaxed">
          By accessing and using Mosaic, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      {/* Use License */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">2. Use License</h2>
        <p className="text-secondary leading-relaxed mb-4">
          Permission is granted to temporarily download one copy of the materials (information or software) on Mosaic for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="space-y-2 text-secondary list-disc list-inside">
          <li>Modifying or copying the materials</li>
          <li>Using the materials for any commercial purpose or for any public display</li>
          <li>Attempting to decompile or reverse engineer any software contained on the site</li>
          <li>Removing any copyright or other proprietary notations from the materials</li>
          <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">3. Disclaimer</h2>
        <p className="text-secondary leading-relaxed">
          The materials on Mosaic are provided on an 'as is' basis. Mosaic makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      {/* Limitations of Liability */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">4. Limitations of Liability</h2>
        <p className="text-secondary leading-relaxed">
          In no event shall Mosaic or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mosaic, even if Mosaic or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      {/* Accuracy of Materials */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">5. Accuracy of Materials</h2>
        <p className="text-secondary leading-relaxed">
          The materials appearing on Mosaic could include technical, typographical, or photographic errors. Mosaic does not warrant that any of the materials on its website are accurate, complete, or current. Mosaic may make changes to the materials contained on its website at any time without notice.
        </p>
      </section>

      {/* Content Aggregation */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">6. Content Aggregation</h2>
        <p className="text-secondary leading-relaxed">
          Mosaic aggregates news content from various public sources. We provide links to and summaries of original content. All original content rights belong to their respective authors and publishers. We respect intellectual property rights and provide attribution through links to original sources.
        </p>
      </section>

      {/* User Accounts */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">7. User Accounts</h2>
        <p className="text-secondary leading-relaxed">
          When you create an account with Mosaic, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You agree to notify Mosaic immediately of any unauthorized use of your account.
        </p>
      </section>

      {/* Modifications to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary font-sora">8. Modifications to Terms</h2>
        <p className="text-secondary leading-relaxed">
          Mosaic may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      {/* Governing Law */}
      <section className="p-6 bg-surface rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-3 text-primary font-sora">9. Governing Law</h2>
        <p className="text-secondary mb-2">
          These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/30">
        <h3 className="font-semibold text-primary mb-2">Questions?</h3>
        <p className="text-secondary">
          If you have questions about these Terms of Service, please contact us at: <span className="text-primary font-semibold">hello@mosaicnews.co.za</span>
        </p>
      </section>
    </main>
  );
}
