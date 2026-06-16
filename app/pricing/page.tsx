import { PricingTable } from "@clerk/nextjs";

function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the plan that best fits your needs and unlock the full
            potential of our platform.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}

export default Pricing;
