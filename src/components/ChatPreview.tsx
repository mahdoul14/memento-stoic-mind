
const ChatPreview = () => {
  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-6 tracking-tight uppercase">
              Wisdom on Demand
            </h2>
            <p className="font-inter text-xl text-gray-600">
              Get personalized Stoic guidance from Marcus Aurelius himself
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gray-900 px-6 py-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="font-inter font-medium text-white ml-4">MarcusGPT</div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-md">
                  <p className="font-inter text-gray-800">What should I focus on today?</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-black text-white rounded-2xl px-6 py-4 max-w-2xl">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full mr-3"></div>
                    <span className="font-inter font-medium text-sm">Marcus Aurelius</span>
                  </div>
                  <p className="font-inter leading-relaxed">
                    Your task is to practice discipline — not to wait for motivation. Focus on what is within your control: your thoughts, your actions, your responses to what befalls you. The rest is merely noise.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-md">
                  <p className="font-inter text-gray-800">How do I handle difficult people?</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-black text-white rounded-2xl px-6 py-4 max-w-2xl">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full mr-3"></div>
                    <span className="font-inter font-medium text-sm">Marcus Aurelius</span>
                  </div>
                  <p className="font-inter leading-relaxed">
                    Remember that their actions reflect their character, not yours. Meet their weakness with your strength, their anger with your patience. You cannot control their behavior, only your response to it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
