import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const PricingSection = () => {
  return <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-6 tracking-tight uppercase">
            Simple, Honest Pricing
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="bg-white border border-gray-200 rounded-2xl p-8 animate-fade-in">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-inter font-bold text-2xl text-black mb-2">
                Monthly Access
              </CardTitle>
              <div className="font-inter font-bold text-4xl text-black">
                £9<span className="text-lg font-medium text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Unlimited tool access
                </li>
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Private journal + history
                </li>
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Cancel anytime
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card style={{
          animationDelay: '0.2s'
        }} className="border-2 border-black rounded-2xl p-8 relative animate-fade-in bg-black">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-inter font-medium">
                Best Value
              </span>
            </div>
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-inter font-bold text-2xl text-black mb-2">
                Lifetime Access
              </CardTitle>
              <div className="font-inter font-bold text-4xl text-black">
                £79<span className="text-lg font-medium text-gray-600"> one-time</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  All tools included forever
                </li>
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Priority access to new tools
                </li>
                <li className="font-inter text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Best value for serious Stoics
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-4 text-lg font-inter font-medium mb-4">
            Unlock Full Access →
          </Button>
          <p className="font-inter text-gray-500 text-sm">
            7-day free trial included. No risk.
          </p>
        </div>
      </div>
    </section>;
};
export default PricingSection;