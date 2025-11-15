export const metadata = {
  title: 'Payment Successful | Axios AI Innovations',
};

const SuccessPage = () => (
  <section className="min-h-[60vh] bg-gray-50 text-gray-900">
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <h1 className="text-4xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="text-lg text-gray-600">
        Thanks for trusting Axios AI Innovations. Check your inbox for the receipt and
        onboarding details. You can close this page or head back to the custom project form anytime.
      </p>
      <a
        href="/custom-project"
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Return to Custom Projects
      </a>
    </div>
  </section>
);

export default SuccessPage;

